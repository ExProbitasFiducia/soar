import { emit } from "https://deno.land/x/emit/mod.ts";
import { resolve } from "https://deno.land/std/path/mod.ts";



const changed = new Map();

if (import.meta.main) { 

    // needs to happen firs or we lose messages
    self.onmessage = (e) => {
        //self.close();
    };

    const watchedDir = resolve("./packages/dashboard/src");

    const watcher = Deno.watchFs(watchedDir);
    for await (const { kind, paths } of watcher) {
        console.log({kind, paths});
        if (kind === "create" || kind === "modify") {
            paths.forEach(async (path) => {
                if (changed.has(path)) {
                    return;
                }
                changed.set(path, setTimeout(async () => {
                    try {
                        await Deno.run({
                            cmd: ["deno", "task", "build"],
                            cwd: "./packages/dashboard"
                        }).status;
                        self.postMessage("SRC_CHANGED");
                        changed.delete(path);
                    } catch (err) {}
                }, 10));
            });
        }
        if (kind === "remove") {
            paths.forEach((path) => {
                clearTimeout(changed.get(path));
                changed.delete(path);
            });
        }
    }
}
