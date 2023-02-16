import { resolve } from "https://deno.land/std/path/mod.ts";

import React from "https://esm.sh/react@18.2.0";
import { renderToString } from "https://esm.sh/react-dom@18.2.0/server";
import { Dashboard } from "./Dashboard.jsx";


const dashboardTemplatePath = new URL(
    "./dashboard.template",
    import.meta.url
).pathname;

const dashboardTemplate = await Deno.readTextFile(dashboardTemplatePath);
const title = "Dashboard";

const ac = new AbortController();

const server = Deno.serve({
    port: 9000,
    signal: ac.signal,
    handler: async (req) => {
        console.log(req);
        if (req.headers.get("upgrade") === "websocket") {
            const { socket, response } = Deno.upgradeWebSocket(req);
            const reloadEventHandler = (data) => {
                console.log("Handling reload event");
                socket.send("RELOAD");
            };
            socket.onopen = () => {
                console.log("Connection established");
                addEventListener("RELOAD", reloadEventHandler);
                socket.send("HELLO!");
            };
            socket.onclose = () => {
                console.log("Connection closed");
                removeEventListener("RELOAD", reloadEventHandler);
            };
            socket.onmessage = () => {
                console.log("Connection closed");
            };
            return response;
        }
            
        const rendered = renderToString(<Dashboard/>);
        
        return new Response(eval(`\`${dashboardTemplate}\``), {
            headers: {
                "Content-Type": "text/html"
            }
        });
    }
});

if (import.meta.main) {
    self.onmessage = async ({ data }) => {
        if (data === "AWAIT_RELOAD_SAFE") {
            console.log("Main thread has requested a reload");
            dispatchEvent(new Event("RELOAD"));
            ac.abort();
            console.log("Sending abort signal to clean up server");
            await server;
            console.log("Main thread is now safe to reload");
            self.postMessage("RELOAD_SAFE"); 
            self.close();
        }
    }
}


