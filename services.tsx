const spawnDashboardService = () => {
    worker: new Worker("./packages/dashboard/service.tsx", {
        type: "module",
        deno: {
            permissions: "inherit"
        }
    }),
    dependencies: []
};

const services = [spawnSashboardService];

reloadService.onmessage = ({ message }) => {
    switch (message) {
        case "
    }
}
