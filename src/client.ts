import { message } from "./lib/message.ts";
new Worker("./worker.js", { type: "module" });
console.log(`${message} (client)`);
