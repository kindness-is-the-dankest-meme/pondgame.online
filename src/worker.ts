import { state } from "./lib/state.ts";
console.log(`${JSON.stringify(state.getState(), null, 2)} (worker)`);

const { host, protocol } = location;
const ws = new WebSocket(`${protocol.replace("http", "ws")}//${host}`);
ws.addEventListener("message", ({ data }) => console.log(`${data} (socket)`));

// TODO: figure out `worker` context
self.postMessage(JSON.stringify(state.getState(), null, 2));
