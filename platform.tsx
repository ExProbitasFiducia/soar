import { resolve } from "https://deno.land/std/path/mod.ts";

import { instantiate } from "https://deno.land/x/emit/lib/emit.generated.js";
import { createCache } from "https://deno.land/x/deno_cache@0.4.1/mod.ts";


//const { bundle } = await instantiate();

const CONTENT_TYPE_PROXY_URL = "http://localhost:10080";
const WATCH = true;

const workers = new Map();

const startWorker = async ({ name, getBuildDir, fileName, onmessage, _build = null }) => {
    console.log(`Starting a ${name} worker`);
    //const cache = createCache({
    //    root: undefined,
    //    cacheSetting: "reloadAll",
    //    allowRemote: undefined
    //});
    //const { code } = await bundle(
    //    new URL(uri, import.meta.url).toString(),
    //    cache.load,
    //    "module",
    //    undefined,
    //    undefined
    //);
    //const blob = new Blob([code], {type: "text/javascript"});
    //const blobUrl = URL.createObjectURL(blob);
    const newBuildId = crypto.randomUUID();
    const buildPath = `./packages/${name}/.build_${newBuildId}`;
    const workerUrl = new URL(`${buildPath}/${fileName}`, import.meta.url).href;
    const alias = Deno.run({
        cmd: ["ln", "-sf", "./src", resolve(buildPath)]
    });
    if (_build) {
    }
    const worker = new Worker(
        workerUrl,     
        {
            type: "module",
            deno: {
                permissions: "inherit"
            }
        }
    );
    worker._build = newBuildId;
    worker.onmessage = ({ data }) => onmessage(data)
    workers.set(name, worker);
    
}

const workerConfigs = {};

workerConfigs["dashboard"] = {
    name: "dashboard",
    fileName: "service.jsx",
    onmessage: async (message) => {
        switch (message) {
            case "RELOAD_SAFE":
                const serviceName = "dashboard";
                const worker = workers.get(serviceName);
                startWorker(workerConfigs[serviceName]);
                const aliasCleanup = Deno.run({
                    cmd: ["rm", resolve(worker._build)]
                });
                try {
                    await aliasCleanup.status
                    await alias.status;
                } catch (err) {}
                break;
        }
    }
};

workerConfigs["watcher"] = {
    name: "watcher",
    fileName: "watcher.ts",
    onmessage: (message) => {
        switch (message) {
            case "SRC_CHANGED":
                ["dashboard"].forEach(serviceName => {
                    const worker = workers.get(serviceName)
                    worker.postMessage("AWAIT_RELOAD_SAFE");
                });
                break;
        }
    }
};

if (WATCH) {
    await startWorker(workerConfigs["watcher"]);
}
await startWorker(workerConfigs["dashboard"]);

const hostDomainMapping = new Map([
    ["github.com", "raw.githubusercontent.com"]
]);

const tasks = new Map([
    ["incrementer", {
        format: "wasm",
        modHost: "github.com",
        modPath: "ExProbitasFiducia/wasm-library/main/incrementer.wasm",
        entrypoint: "increment"
    }],
    ["dashboard", {
        format: "wasm",
        modHost: "local",
        modPath: "dashboard.wasm",
        entrypoint: "render"
    }],
    ["helloJs", {
        type: "js",
        modUri: ""
    }]
]);

const execTask = async (taskId) => {

    const {
        format,
        modHost,
        modPath,
        entrypoint
    } = tasks.get(taskId);

    const hostDomain = hostDomainMapping.has(modHost)
        ? hostDomainMapping.get(modHost)
        : modHost;

    const { instance } = await WebAssembly.instantiateStreaming(
        fetch(`${CONTENT_TYPE_PROXY_URL}/${hostDomain}/${modPath}`),
        { imports: {} }
    );
    console.log(instance);

    return instance.exports[entrypoint]();

};

console.log("Initialization has completed");
