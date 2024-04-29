const w = new Worker("./worker.js", { type: "module" });
w.addEventListener("message", ({ data }) => console.log(`${data} (client)`));

// TODO: figure out `window` context
