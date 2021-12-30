/**
 * I prefer to keep `"type": "module"` in the `package.json` file, but the
 * `require` semantics are required for loading Node addons
 *
 * @see https://stackoverflow.com/a/66527729/1577876
 */
import { createRequire } from "module";
import { resolve } from "path";

const { RTCPeerConnection: NativeRTCPeerConnection } = createRequire(
  resolve(process.cwd(), "node_modules")
)("wrtc/build/Release/wrtc.node");

/**
 * experimental
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCIdentityAssertion
 */
interface RTCIdentityAssertion {
  idp: string;
  name: string;
}

/**
 * experimental
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCSctpTransport
 */
interface RTCSctpTransport extends EventTarget {
  readonly maxChannels: number;
  readonly maxMessageSize: number;
  readonly state: string;
  readonly transport: globalThis.RTCDtlsTransport;
  onstatechange: ((this: RTCSctpTransport, ev: Event) => any) | null;
}

interface IRTCPeerConnection
  extends Omit<
    RTCPeerConnection,
    | "addIceCandidate"
    | "createAnswer"
    | "createOffer"
    | "setLocalDescription"
    | "setRemoteDescription"
  > {
  readonly peerIdentity: Promise<RTCIdentityAssertion>;
  readonly sctp: RTCSctpTransport;

  addIceCandidate(candidate?: RTCIceCandidateInit): Promise<void>;
  createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit>;
  createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
  setLocalDescription(
    description?: RTCLocalSessionDescriptionInit
  ): Promise<void>;
  setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
}

interface AnyConstructor {
  prototype: any;
  new (...args: any[]): any;
}

/**
 * would love to return `Omit<keyof T, "constructor">` here if possible
 */
const propsOf = <T extends AnyConstructor>(
  Constructor: T,
  omitProps: string[] = ["constructor"]
): string[] =>
  Object.getOwnPropertyNames(Constructor.prototype)
    .filter((prop) => !omitProps.includes(prop))
    .sort();

const eventTargetProps = propsOf(EventTarget);
const rtcPeerConnectionProps = propsOf(NativeRTCPeerConnection, [
  "constructor",
  "legacyGetStats",
  "sctp",
  "updateIce",
]);

const isEventTargetProp = (
  property: string | symbol
): property is keyof EventTarget =>
  typeof property === "string" && eventTargetProps.includes(property);

const isRTCPeerConnectionProp = (
  property: string | symbol
): property is keyof RTCPeerConnection =>
  typeof property === "string" && rtcPeerConnectionProps.includes(property);

const eventTypes = [
  // "addstream", // deprecated
  "connectionstatechange",
  "datachannel",
  "icecandidate",
  "icecandidateerror",
  "iceconnectionstatechange",
  "icegatheringstatechange",
  "negotiationneeded",
  // "removestream", // deprecated
  "signalingstatechange",
  "track",
];

class RtcPeerConnection {
  constructor(configuration?: RTCConfiguration) {
    const rtcPeerConnection = new NativeRTCPeerConnection(configuration);
    const eventTarget = new EventTarget();

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
        return Reflect.set(target, property, value, receiver);
      },
    });
  }
}

export const createRTCPeerConnection = (
  configuration?: RTCConfiguration
): IRTCPeerConnection => {
  const rtcPeerConnection = new NativeRTCPeerConnection(configuration);
  const eventTarget = new EventTarget();

  eventTypes.forEach((eventType) => {
    rtcPeerConnection[`on${eventType}`] = () => {
      eventTarget.dispatchEvent(new Event(eventType));
    };
  });

  return new Proxy(rtcPeerConnection, {
    get: (target: IRTCPeerConnection, property) =>
      isEventTargetProp(property)
        ? eventTarget[property]
        : Reflect.get(target, property),
  });
};
