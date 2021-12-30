import { NativeRTCPeerConnection } from "./binding";
import { propsOf } from "./util";

/**
 * `EventTarget` properties
 */
const eventTargetProps = propsOf(EventTarget);

const isEventTargetProp = (
  property: string | symbol
): property is keyof EventTarget =>
  typeof property === "string" && eventTargetProps.includes(property);

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

export class RTCPeerConnection {
  constructor(configuration?: RTCConfiguration) {
    const rtcPeerConnection = new NativeRTCPeerConnection(configuration);
    const eventTarget = new EventTarget();

    eventTypes.forEach((eventType) => {
      rtcPeerConnection[`on${eventType}`] = () => {};
    });

    return new Proxy(this, {
      get(target, property, receiver) {
        if (isRTCPeerConnectionProp(property)) {
          return rtcPeerConnection[property];
        }

        if (isEventTargetProp(property)) {
          return eventTarget[property];
        }

        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        if (
          typeof property === "string" &&
          property.startsWith("on") &&
          eventTypes.includes(property.substring(2))
        ) {
          const prevListener = Reflect.get(target, property);
          if (prevListener !== null) {
            eventTarget.removeEventListener(
              property.substring(2),
              prevListener
            );
          }

          if (typeof value === "function") {
            eventTarget.addEventListener(property.substring(2), value);
          }
        }

        return Reflect.set(target, property, value, receiver);
      },
    });
  }
}
