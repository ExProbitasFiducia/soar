const blob = new Blob([`console.log("Hi from blob!");`], {type: "text/javascript"});
const blobUrl = URL.createObjectURL(blob);

const wk = new Worker(blobUrl, { type: "module" });



