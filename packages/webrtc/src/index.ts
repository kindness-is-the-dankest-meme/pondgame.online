import { NativeRTCPeerConnection } from "./binding.js";
import { createEventTarget } from "./util.js";

const RTCPeerConnection = createEventTarget(NativeRTCPeerConnection, {
  connectionstatechange: () => new Event("connectionstatechange"),
  datachannel: (channel: RTCDataChannel) =>
    new RTCDataChannelEvent("datachannel", { channel }),
  icecandidate: (partialCandidate: Partial<RTCIceCandidate>) =>
    new RTCPeerConnectionIceEvent("icecandidate", {
      candidate: new RTCIceCandidate(partialCandidate),
    }),
  icecandidateerror: (
    eventInit: Omit<RTCPeerConnectionIceErrorEventInit, "address" | "port"> & {
      hostCandidate: string;
    }
  ) => {
    const { hostCandidate, errorCode, errorText, url } = eventInit;
    const [address, port] = hostCandidate.split(":");

    return new RTCPeerConnectionIceErrorEvent("icecandidateerror", {
      address,
      errorCode,
      errorText,
      port: port ? parseInt(port, 10) : null,
      url,
    });
  },
  iceconnectionstatechange: () => new Event("iceconnectionstatechange"),
  icegatheringstatechange: () => new Event("icegatheringstatechange"),
  negotiationneeded: () => new Event("negotiationneeded"),
  signalingstatechange: () => new Event("signalingstatechange"),
  track: (
    receiver: RTCRtpReceiver,
    streams: MediaStream[],
    transceiver: RTCRtpTransceiver
  ) => {
    const { track } = receiver;

    return new RTCTrackEvent("track", {
      receiver,
      streams,
      track,
      transceiver,
    });
  },
});

const rtcp = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
  ],
});
rtcp.createDataChannel("test");

rtcp.onnegotiationneeded = () => console.log("rtcp.onnegotiationneeded");

rtcp.addEventListener("negotiationneeded", () =>
  console.log("rtcp.addEventListener")
);

// import { RTCDataChannel } from "./binding.js";
// export { RTCPeerConnection } from "./RTCPeerConnection.js";

// /**
//  * make `RTCDataChannel` an `EventTarget` without creating a new class
//  */
// Object.setPrototypeOf(RTCDataChannel.prototype, EventTarget.prototype);

// const rtcDataChannelEventTypes: (keyof RTCDataChannelEventMap)[] = [
//   "bufferedamountlow",
//   "close",
//   "error",
//   "message",
//   "open",
// ];

// const isRTCDataChannelEventType = (
//   type: string
// ): type is keyof RTCDataChannelEventMap =>
//   (rtcDataChannelEventTypes as string[]).includes(type);

// /**
//  * override `dispatchEvent` to make sure we also call any event listeners
//  * registered via `on${event.type}` callbacks
//  */
// RTCDataChannel.prototype.dispatchEvent = function dispatchEvent(
//   event: Event | MessageEvent
// ) {
//   if (
//     isRTCDataChannelEventType(event.type) &&
//     typeof this[`on${event.type}`] === "function"
//   ) {
//     this[`on${event.type}`]?.(
//       /**
//        * `event as RTCDataChannelEventMap[event.type]` seems like what I
//        * want, but it winds up creating an `Event & MessageEvent` type
//        */
//       event as any
//     );
//   }

//   return EventTarget.prototype.dispatchEvent.call(this, event);
// };
