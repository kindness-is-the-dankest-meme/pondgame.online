import { RTCDataChannel } from "./binding.js";
export { RTCPeerConnection } from "./RTCPeerConnection.js";

/**
 * make `RTCDataChannel` an `EventTarget` without creating a new class
 */
Object.setPrototypeOf(RTCDataChannel.prototype, EventTarget.prototype);

const rtcDataChannelEventTypes: (keyof RTCDataChannelEventMap)[] = [
  "bufferedamountlow",
  "close",
  "error",
  "message",
  "open",
];

const isRTCDataChannelEventType = (
  type: string
): type is keyof RTCDataChannelEventMap =>
  (rtcDataChannelEventTypes as string[]).includes(type);

/**
 * override `dispatchEvent` to make sure we also call any event listeners
 * registered via `on${event.type}` callbacks
 */
RTCDataChannel.prototype.dispatchEvent = function dispatchEvent(
  event: Event | MessageEvent
) {
  if (
    isRTCDataChannelEventType(event.type) &&
    typeof this[`on${event.type}`] === "function"
  ) {
    this[`on${event.type}`]?.(
      /**
       * `event as RTCDataChannelEventMap[event.type]` seems like what I
       * want, but it winds up creating an `Event & RTCDataChannelEvent &
       * RTCDataChannelIceEvent & RTCTrackEvent` type
       */
      event as any
    );
  }

  return EventTarget.prototype.dispatchEvent.call(this, event);
};
