import { message } from "./lib/message.ts";
console.log(`${message} (worker)`);

const { host, protocol } = location;
const ws = new WebSocket(`${protocol.replace("http", "ws")}//${host}`);
ws.addEventListener("message", ({ data }) => console.log(`${data} (socket)`));
