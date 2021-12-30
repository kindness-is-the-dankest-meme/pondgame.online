import { NativeRTCPeerConnection } from "./binding.js";
import { propsOf } from "./util.js";

/**
 * `RTCPeerConnection` properties
 */
const rtcPeerConnectionProps = propsOf(NativeRTCPeerConnection, [
  "constructor",
  "legacyGetStats", // non-standard
  "sctp", // experimental
  "updateIce", // non-standard
]);

const isRTCPeerConnectionProp = (
  property: string | symbol
): property is keyof RTCPeerConnection =>
  typeof property === "string" && rtcPeerConnectionProps.includes(property);

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
  constructor(configuration?: RTCConfiguration) {
    super();

    const rtcPeerConnection = new NativeRTCPeerConnection(configuration);
    // eventTypes.forEach((eventType) => {
    //   rtcPeerConnection[`on${eventType}`] = ({ type }: Event) => {
    //     console.log({ type });
    //   };
    // });
    console.log({ rtcPeerConnection });
    rtcPeerConnection.onnegotiationneeded = ({ type }: Event) => {
      console.log({ type });
    };

    return new Proxy(this, {
      get(target, property, receiver) {
        return isRTCPeerConnectionProp(property)
          ? rtcPeerConnection[property]
          : Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        if (
          typeof property === "string" &&
          property.startsWith("on") &&
          eventTypes.includes(property.substring(2))
        ) {
          const prevListener = Reflect.get(target, property);
          if (prevListener !== null) {
            target.removeEventListener(property.substring(2), prevListener);
          }

          if (typeof value === "function") {
            target.addEventListener(property.substring(2), value);
          }
        }

        return Reflect.set(target, property, value, receiver);
      },
    });
  }
}

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

//@ts-expect-error - will type this up later
rtcp.onnegotiationneeded = ({ type }: Event) => {
  console.log({ type });
};
rtcp.addEventListener("negotiationneeded", ({ type }: Event) => {
  console.log({ type });
});

//@ts-expect-error - will type this up later
console.log({ rtcp, connectionState: rtcp.connectionState });
