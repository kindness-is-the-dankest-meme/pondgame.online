import { message } from "./lib/message.ts";
console.log(`${message} (client)`);

new Worker("./worker.js", { type: "module" });

// TODO: figure out how to bring lib dom types in here
// globalThis.addEventListener("pointermove", ({ x, y }) => {
//   c.style.transform = `translate(${x}px,${y}px)`;
// });
