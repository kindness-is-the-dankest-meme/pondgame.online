export { RTCPeerConnection } from "./RTCPeerConnection.js";

process.on("uncaughtException", (error) => {
  console.log({ error });
});
