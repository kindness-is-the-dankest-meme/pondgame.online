import { NativeRTCDataChannel } from "./binding.js";
import { createEventTarget } from "./createEventTarget.js";
export { RTCPeerConnection } from "./RTCPeerConnection.js";

export const RTCDataChannel = createEventTarget<
  typeof globalThis.RTCDataChannel,
  globalThis.RTCDataChannelEventMap & {
    [eventType: string]: Event;
  }
>(NativeRTCDataChannel, {
  bufferedamountlow: () => new Event("bufferedamountlow"),
  close: () => new Event("close"),
  error: () => new Event("error"),
  message: (eventInit: MessageEventInit) =>
    new MessageEvent("message", eventInit),
  open: () => new Event("open"),
});
