import { NativeRTCPeerConnection } from "./binding.js";
import { propsOf } from "./util.js";

/**
 * `EventTarget` properties
 */
const eventTargetProps = propsOf(EventTarget);

const isEventTargetProp = (
  property: string | symbol
): property is keyof EventTarget =>
  typeof property === "string" && eventTargetProps.includes(property);

// /**
//  * `RTCPeerConnection` properties
//  */
// const rtcPeerConnectionProps = propsOf(NativeRTCPeerConnection, [
//   "constructor",
//   "legacyGetStats", // non-standard
//   "sctp", // experimental
//   "updateIce", // non-standard
// ]);

// const isRTCPeerConnectionProp = (
//   property: string | symbol
// ): property is keyof RTCPeerConnection =>
//   typeof property === "string" && rtcPeerConnectionProps.includes(property);

/**
 * `RTCPeerConnection` event types, not including deprecated `"addstream"` and
 * `"removestream"` types
 */
const eventTypes = [
  "connectionstatechange",
  "datachannel",
  "icecandidate",
  "icecandidateerror",
  "iceconnectionstatechange",
  "icegatheringstatechange",
  "negotiationneeded",
  "signalingstatechange",
  "track",
];

export class RTCPeerConnection extends EventTarget {
  #nativeRtcPeerConnection: typeof NativeRTCPeerConnection;
  get nativeRtcPeerConnection() {
    return this.#nativeRtcPeerConnection;
  }

  constructor(configuration?: RTCConfiguration) {
    super();

    this.#nativeRtcPeerConnection = new NativeRTCPeerConnection(configuration);
  }
}

// Object.entries(
//   Object.getOwnPropertyDescriptors(NativeRTCPeerConnection.prototype)
// )
//   .filter(
//     ([, descriptor]) =>
//       "value" in descriptor && typeof descriptor.value === "function"
//   )
//   .forEach(([name]) => {
//     // @ts-expect-error
//     RTCPeerConnection.prototype[name] = function (...args: any[]) {
//       return this.nativeRtcPeerConnection[name](...args);
//     };
//   });

console.log(
  Object.getOwnPropertyDescriptors(NativeRTCPeerConnection.prototype),
  Object.getPrototypeOf(new RTCPeerConnection()) === RTCPeerConnection.prototype
);

// const rtcp = new RTCPeerConnection({
//   iceServers: [
//     {
//       urls: [
//         "stun:stun.l.google.com:19302",
//         "stun:global.stun.twilio.com:3478",
//       ],
//     },
//   ],
// });
// // @ts-expect-error
// rtcp.createDataChannel("test");
// // @ts-expect-error
// rtcp.onnegotiationneeded = ({ type }: Event) => {
//   console.log("\n\n\nrtcp.onnegotiationneeded", { type });
// };
// rtcp.addEventListener("negotiationneeded", ({ type }: Event) => {
//   console.log("\n\n\nrtcp.addEventListener", { type });
// });
// // @ts-expect-error
// console.log({ rtcp, connectionState: rtcp.connectionState });
