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
    globalThis.RTCPeerConnection,
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

/**
 * extending from `EventTarget` directly confuses the typings around custom
 * events ... weird, but works
 *
 * @see https://dev.to/43081j/strongly-typed-event-emitters-using-eventtarget-in-typescript-3658
 */
const RTCPeerConnectionTarget = EventTarget as {
  new (): IRTCPeerConnection;
  prototype: IRTCPeerConnection;
};

export class RTCPeerConnection
  extends RTCPeerConnectionTarget
  implements IRTCPeerConnection
{
  #rtcp: IRTCPeerConnection;

  get canTrickleIceCandidates(): boolean | null {
    return this.#rtcp.canTrickleIceCandidates;
  }
  get connectionState(): RTCPeerConnectionState {
    return this.#rtcp.connectionState;
  }
  get currentLocalDescription(): RTCSessionDescription | null {
    return this.#rtcp.currentLocalDescription;
  }
  get currentRemoteDescription(): RTCSessionDescription | null {
    return this.#rtcp.currentRemoteDescription;
  }
  get iceConnectionState(): RTCIceConnectionState {
    return this.#rtcp.iceConnectionState;
  }
  get iceGatheringState(): RTCIceGatheringState {
    return this.#rtcp.iceGatheringState;
  }
  get localDescription(): RTCSessionDescription | null {
    return this.#rtcp.localDescription;
  }
  /**
   * experimental
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCIdentityAssertion
   */
  get peerIdentity(): Promise<RTCIdentityAssertion> {
    return this.#rtcp.peerIdentity;
  }
  get pendingLocalDescription(): RTCSessionDescription | null {
    return this.#rtcp.pendingLocalDescription;
  }
  get pendingRemoteDescription(): RTCSessionDescription | null {
    return this.#rtcp.pendingRemoteDescription;
  }
  get remoteDescription(): RTCSessionDescription | null {
    return this.#rtcp.remoteDescription;
  }
  /**
   * experimental
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCSctpTransport
   */
  get sctp(): RTCSctpTransport {
    return this.#rtcp.sctp;
  }
  get signalingState(): RTCSignalingState {
    return this.#rtcp.signalingState;
  }

  constructor(configuration?: RTCConfiguration) {
    super();

    this.#rtcp = new NativeRTCPeerConnection(configuration);
  }

  #onconnectionstatechange: IRTCPeerConnection["onconnectionstatechange"] =
    null;
  get onconnectionstatechange() {
    return this.#onconnectionstatechange;
  }
  set onconnectionstatechange(
    listener: IRTCPeerConnection["onconnectionstatechange"]
  ) {
    if (this.#onconnectionstatechange) {
      this.removeEventListener(
        "connectionstatechange",
        this.#onconnectionstatechange
      );
    }

    if (listener !== null) {
      this.addEventListener("connectionstatechange", listener);
    }

    this.#onconnectionstatechange = listener;
  }

  #ondatachannel: IRTCPeerConnection["ondatachannel"] = null;
  get ondatachannel() {
    return this.#ondatachannel;
  }
  set ondatachannel(listener: IRTCPeerConnection["ondatachannel"]) {
    if (this.#ondatachannel) {
      this.removeEventListener("datachannel", this.#ondatachannel);
    }

    if (listener !== null) {
      this.addEventListener("datachannel", listener);
    }

    this.#ondatachannel = listener;
  }

  #onicecandidate: IRTCPeerConnection["onicecandidate"] = null;
  get onicecandidate() {
    return this.#onicecandidate;
  }
  set onicecandidate(listener: IRTCPeerConnection["onicecandidate"]) {
    if (this.#onicecandidate) {
      this.removeEventListener("icecandidate", this.#onicecandidate);
    }

    if (listener !== null) {
      this.addEventListener("icecandidate", listener);
    }

    this.#onicecandidate = listener;
  }

  #onicecandidateerror: IRTCPeerConnection["onicecandidateerror"] = null;
  get onicecandidateerror() {
    return this.#onicecandidateerror;
  }
  set onicecandidateerror(listener: IRTCPeerConnection["onicecandidateerror"]) {
    if (this.#onicecandidateerror) {
      this.removeEventListener("icecandidateerror", this.#onicecandidateerror);
    }

    if (listener !== null) {
      this.addEventListener("icecandidateerror", listener);
    }

    this.#onicecandidateerror = listener;
  }

  #oniceconnectionstatechange: IRTCPeerConnection["oniceconnectionstatechange"] =
    null;
  get oniceconnectionstatechange() {
    return this.#oniceconnectionstatechange;
  }
  set oniceconnectionstatechange(
    listener: IRTCPeerConnection["oniceconnectionstatechange"]
  ) {
    if (this.#oniceconnectionstatechange) {
      this.removeEventListener(
        "iceconnectionstatechange",
        this.#oniceconnectionstatechange
      );
    }

    if (listener !== null) {
      this.addEventListener("iceconnectionstatechange", listener);
    }

    this.#oniceconnectionstatechange = listener;
  }

  #onicegatheringstatechange: IRTCPeerConnection["onicegatheringstatechange"] =
    null;
  get onicegatheringstatechange() {
    return this.#onicegatheringstatechange;
  }
  set onicegatheringstatechange(
    listener: IRTCPeerConnection["onicegatheringstatechange"]
  ) {
    if (this.#onicegatheringstatechange) {
      this.removeEventListener(
        "icegatheringstatechange",
        this.#onicegatheringstatechange
      );
    }

    if (listener !== null) {
      this.addEventListener("icegatheringstatechange", listener);
    }

    this.#onicegatheringstatechange = listener;
  }

  #onnegotiationneeded: IRTCPeerConnection["onnegotiationneeded"] = null;
  get onnegotiationneeded() {
    return this.#onnegotiationneeded;
  }
  set onnegotiationneeded(listener: IRTCPeerConnection["onnegotiationneeded"]) {
    if (this.#onnegotiationneeded) {
      this.removeEventListener("negotiationneeded", this.#onnegotiationneeded);
    }

    if (listener !== null) {
      this.addEventListener("negotiationneeded", listener);
    }

    this.#onnegotiationneeded = listener;
  }

  #onsignalingstatechange: IRTCPeerConnection["onsignalingstatechange"] = null;
  get onsignalingstatechange() {
    return this.#onsignalingstatechange;
  }
  set onsignalingstatechange(
    listener: IRTCPeerConnection["onsignalingstatechange"]
  ) {
    if (this.#onsignalingstatechange) {
      this.removeEventListener(
        "signalingstatechange",
        this.#onsignalingstatechange
      );
    }

    if (listener !== null) {
      this.addEventListener("signalingstatechange", listener);
    }

    this.#onsignalingstatechange = listener;
  }

  #ontrack: IRTCPeerConnection["ontrack"] = null;
  get ontrack() {
    return this.#ontrack;
  }
  set ontrack(listener: IRTCPeerConnection["ontrack"]) {
    if (this.#ontrack) {
      this.removeEventListener("track", this.#ontrack);
    }

    if (listener !== null) {
      this.addEventListener("track", listener);
    }

    this.#ontrack = listener;
  }

  addIceCandidate(candidate?: RTCIceCandidateInit): Promise<void> {
    return this.#rtcp.addIceCandidate(candidate);
  }

  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender {
    return this.#rtcp.addTrack(track, ...streams);
  }

  addTransceiver(
    trackOrKind: MediaStreamTrack | string,
    init?: RTCRtpTransceiverInit
  ): RTCRtpTransceiver {
    return this.#rtcp.addTransceiver(trackOrKind, init);
  }

  close(): void {
    return this.#rtcp.close();
  }

  createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit> {
    return this.#rtcp.createAnswer(options);
  }
  // prettier-ignore
  createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel;
  // prettier-ignore
  createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
  // prettier-ignore
  getConfiguration(): RTCConfiguration;
  // prettier-ignore
  getReceivers(): RTCRtpReceiver[];
  // prettier-ignore
  getSenders(): RTCRtpSender[];
  // prettier-ignore
  getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport>;
  // prettier-ignore
  getTransceivers(): RTCRtpTransceiver[];
  // prettier-ignore
  removeTrack(sender: RTCRtpSender): void;
  // prettier-ignore
  restartIce(): void;
  // prettier-ignore
  setConfiguration(configuration?: RTCConfiguration): void;
  // prettier-ignore
  setLocalDescription(description?: RTCLocalSessionDescriptionInit): Promise<void>;
  // prettier-ignore
  setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
}
