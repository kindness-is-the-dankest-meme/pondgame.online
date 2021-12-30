import { NativeRTCPeerConnection } from "./binding.js";

/**
 * hacky, but it works
 *
 * @see https://dev.to/43081j/strongly-typed-event-emitters-using-eventtarget-in-typescript-3658
 */
interface RTCPeerConnectionEventTarget extends EventTarget {
  addEventListener<K extends keyof RTCPeerConnectionEventMap>(
    type: K,
    listener: (
      this: RTCPeerConnection,
      ev: RTCPeerConnectionEventMap[K]
    ) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof RTCPeerConnectionEventMap>(
    type: K,
    listener: (
      this: RTCPeerConnection,
      ev: RTCPeerConnectionEventMap[K]
    ) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

const RTCPeerConnectionEventTarget = EventTarget as {
  prototype: RTCPeerConnectionEventTarget;
  new (): RTCPeerConnectionEventTarget;
};

export class RTCPeerConnection extends RTCPeerConnectionEventTarget {
  #nativeRTCPeerConnection: typeof NativeRTCPeerConnection;

  // canTrickleIceCandidates: boolean | null;
  get canTrickleIceCandidates(): boolean | null {
    return this.#nativeRTCPeerConnection.canTrickleIceCandidates;
  }

  // connectionState: RTCPeerConnectionState;
  get connectionState(): RTCPeerConnectionState {
    return this.#nativeRTCPeerConnection.connectionState;
  }

  // currentLocalDescription: RTCSessionDescription | null;
  get currentLocalDescription(): RTCSessionDescription | null {
    return this.#nativeRTCPeerConnection.currentLocalDescription;
  }

  // currentRemoteDescription: RTCSessionDescription | null;
  get currentRemoteDescription(): RTCSessionDescription | null {
    return this.#nativeRTCPeerConnection.currentRemoteDescription;
  }

  // iceConnectionState: RTCIceConnectionState;
  get iceConnectionState(): RTCIceConnectionState {
    return this.#nativeRTCPeerConnection.iceConnectionState;
  }

  // iceGatheringState: RTCIceGatheringState;
  get iceGatheringState(): RTCIceGatheringState {
    return this.#nativeRTCPeerConnection.iceGatheringState;
  }

  // localDescription: RTCSessionDescription | null;
  get localDescription(): RTCSessionDescription | null {
    return this.#nativeRTCPeerConnection.localDescription;
  }

  // pendingLocalDescription: RTCSessionDescription | null;
  get pendingLocalDescription(): RTCSessionDescription | null {
    return this.#nativeRTCPeerConnection.pendingLocalDescription;
  }

  // pendingRemoteDescription: RTCSessionDescription | null;
  get pendingRemoteDescription(): RTCSessionDescription | null {
    return this.#nativeRTCPeerConnection.pendingRemoteDescription;
  }

  // remoteDescription: RTCSessionDescription | null;
  get remoteDescription(): RTCSessionDescription | null {
    return this.#nativeRTCPeerConnection.remoteDescription;
  }

  // signalingState: RTCSignalingState;
  get signalingState(): RTCSignalingState {
    return this.#nativeRTCPeerConnection.signalingState;
  }

  constructor(configuration?: RTCConfiguration) {
    super();

    this.#nativeRTCPeerConnection = new NativeRTCPeerConnection(configuration);

    // onconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    this.#nativeRTCPeerConnection.onconnectionstatechange = (event: Event) =>
      this.dispatchEvent(event);

    // ondatachannel: ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any) | null;
    this.#nativeRTCPeerConnection.ondatachannel = (
      event: RTCDataChannelEvent
    ) => this.dispatchEvent(event);

    // onicecandidate: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any) | null;
    this.#nativeRTCPeerConnection.onicecandidate = (
      event: RTCPeerConnectionIceEvent
    ) => this.dispatchEvent(event);

    // onicecandidateerror: ((this: RTCPeerConnection, ev: Event) => any) | null;
    this.#nativeRTCPeerConnection.onicecandidateerror = (event: Event) =>
      this.dispatchEvent(event);

    // oniceconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    this.#nativeRTCPeerConnection.oniceconnectionstatechange = (event: Event) =>
      this.dispatchEvent(event);

    // onicegatheringstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    this.#nativeRTCPeerConnection.onicegatheringstatechange = (event: Event) =>
      this.dispatchEvent(event);

    // onnegotiationneeded: ((this: RTCPeerConnection, ev: Event) => any) | null;
    this.#nativeRTCPeerConnection.onnegotiationneeded = (event: Event) =>
      this.dispatchEvent(event);

    // onsignalingstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    this.#nativeRTCPeerConnection.onsignalingstatechange = (event: Event) =>
      this.dispatchEvent(event);

    // ontrack: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null;
    this.#nativeRTCPeerConnection.ontrack = (event: RTCTrackEvent) =>
      this.dispatchEvent(event);
  }

  // onconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
  #onconnectionstatechange:
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null = null;
  get onconnectionstatechange():
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null {
    return this.#onconnectionstatechange;
  }
  set onconnectionstatechange(
    listener: ((this: RTCPeerConnection, ev: Event) => any) | null
  ) {
    if (this.#onconnectionstatechange !== null) {
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

  // ondatachannel: ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any) | null;
  #ondatachannel:
    | ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any)
    | null = null;
  get ondatachannel():
    | ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any)
    | null {
    return this.#ondatachannel;
  }
  set ondatachannel(
    listener: ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any) | null
  ) {
    if (this.#ondatachannel !== null) {
      this.removeEventListener("datachannel", this.#ondatachannel);
    }

    if (listener !== null) {
      this.addEventListener("datachannel", listener);
    }

    this.#ondatachannel = listener;
  }

  // onicecandidate: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any) | null;
  #onicecandidate:
    | ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any)
    | null = null;
  get onicecandidate():
    | ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any)
    | null {
    return this.#onicecandidate;
  }
  set onicecandidate(
    listener:
      | ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any)
      | null
  ) {
    if (this.#onicecandidate !== null) {
      this.removeEventListener("icecandidate", this.#onicecandidate);
    }

    if (listener !== null) {
      this.addEventListener("icecandidate", listener);
    }

    this.#onicecandidate = listener;
  }

  // onicecandidateerror: ((this: RTCPeerConnection, ev: Event) => any) | null;
  #onicecandidateerror: ((this: RTCPeerConnection, ev: Event) => any) | null =
    null;
  get onicecandidateerror():
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null {
    return this.#onicecandidateerror;
  }
  set onicecandidateerror(
    listener: ((this: RTCPeerConnection, ev: Event) => any) | null
  ) {
    if (this.#onicecandidateerror !== null) {
      this.removeEventListener("icecandidateerror", this.#onicecandidateerror);
    }

    if (listener !== null) {
      this.addEventListener("icecandidateerror", listener);
    }

    this.#onicecandidateerror = listener;
  }

  // oniceconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
  #oniceconnectionstatechange:
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null = null;
  get oniceconnectionstatechange():
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null {
    return this.#oniceconnectionstatechange;
  }
  set oniceconnectionstatechange(
    listener: ((this: RTCPeerConnection, ev: Event) => any) | null
  ) {
    if (this.#oniceconnectionstatechange !== null) {
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

  // onicegatheringstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
  #onicegatheringstatechange:
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null = null;
  get onicegatheringstatechange():
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null {
    return this.#onicegatheringstatechange;
  }
  set onicegatheringstatechange(
    listener: ((this: RTCPeerConnection, ev: Event) => any) | null
  ) {
    if (this.#onicegatheringstatechange !== null) {
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

  // onnegotiationneeded: ((this: RTCPeerConnection, ev: Event) => any) | null;
  #onnegotiationneeded: ((this: RTCPeerConnection, ev: Event) => any) | null =
    null;
  get onnegotiationneeded():
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null {
    return this.#onnegotiationneeded;
  }
  set onnegotiationneeded(
    listener: ((this: RTCPeerConnection, ev: Event) => any) | null
  ) {
    if (this.#onnegotiationneeded !== null) {
      this.removeEventListener("negotiationneeded", this.#onnegotiationneeded);
    }

    if (listener !== null) {
      this.addEventListener("negotiationneeded", listener);
    }

    this.#onnegotiationneeded = listener;
  }

  // onsignalingstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
  #onsignalingstatechange:
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null = null;
  get onsignalingstatechange():
    | ((this: RTCPeerConnection, ev: Event) => any)
    | null {
    return this.#onsignalingstatechange;
  }
  set onsignalingstatechange(
    listener: ((this: RTCPeerConnection, ev: Event) => any) | null
  ) {
    if (this.#onsignalingstatechange !== null) {
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

  // ontrack: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null;
  #ontrack: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null = null;
  get ontrack(): ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null {
    return this.#ontrack;
  }
  set ontrack(
    listener: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null
  ) {
    if (this.#ontrack !== null) {
      this.removeEventListener("track", this.#ontrack);
    }

    if (listener !== null) {
      this.addEventListener("track", listener);
    }

    this.#ontrack = listener;
  }

  // addIceCandidate(candidate?: RTCIceCandidateInit): Promise<void>;
  addIceCandidate(candidate?: RTCIceCandidateInit): Promise<void> {
    return this.#nativeRTCPeerConnection.addIceCandidate(candidate);
  }

  // addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender;
  addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender {
    return this.#nativeRTCPeerConnection.addTrack(track, ...streams);
  }

  // addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver;
  addTransceiver(
    trackOrKind: MediaStreamTrack | string,
    init?: RTCRtpTransceiverInit
  ): RTCRtpTransceiver {
    return this.#nativeRTCPeerConnection.addTransceiver(trackOrKind, init);
  }

  // close(): void;
  close(): void {
    return this.#nativeRTCPeerConnection.close();
  }

  // createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit>;
  createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit> {
    return this.#nativeRTCPeerConnection.createAnswer(options);
  }

  // createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel;
  createDataChannel(
    label: string,
    dataChannelDict?: RTCDataChannelInit
  ): RTCDataChannel {
    return this.#nativeRTCPeerConnection.createDataChannel(
      label,
      dataChannelDict
    );
  }

  // createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
  createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit> {
    return this.#nativeRTCPeerConnection.createOffer(options);
  }

  // getConfiguration(): RTCConfiguration;
  getConfiguration(): RTCConfiguration {
    return this.#nativeRTCPeerConnection.getConfiguration();
  }

  // getReceivers(): RTCRtpReceiver[];
  getReceivers(): RTCRtpReceiver[] {
    return this.#nativeRTCPeerConnection.getReceivers();
  }

  // getSenders(): RTCRtpSender[];
  getSenders(): RTCRtpSender[] {
    return this.#nativeRTCPeerConnection.getSenders();
  }

  // getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport>;
  getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport> {
    return this.#nativeRTCPeerConnection.getStats(selector);
  }

  // getTransceivers(): RTCRtpTransceiver[];
  getTransceivers(): RTCRtpTransceiver[] {
    return this.#nativeRTCPeerConnection.getTransceivers();
  }

  // removeTrack(sender: RTCRtpSender): void;
  removeTrack(sender: RTCRtpSender): void {
    return this.#nativeRTCPeerConnection.removeTrack(sender);
  }

  // restartIce(): void;
  restartIce(): void {
    return this.#nativeRTCPeerConnection.restartIce();
  }

  // setConfiguration(configuration?: RTCConfiguration): void;
  setConfiguration(configuration?: RTCConfiguration): void {
    return this.#nativeRTCPeerConnection.setConfiguration(configuration);
  }

  // setLocalDescription(description?: RTCLocalSessionDescriptionInit): Promise<void>;
  setLocalDescription(
    description?: RTCLocalSessionDescriptionInit
  ): Promise<void> {
    return this.#nativeRTCPeerConnection.setLocalDescription(description);
  }

  // setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
  setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    return this.#nativeRTCPeerConnection.setRemoteDescription(description);
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

rtcp.createDataChannel("test");

rtcp.onnegotiationneeded = () => {
  console.log("rtcp.onnegotiationneeded");
};

rtcp.addEventListener("negotiationneeded", () => {
  console.log("rtcp.onnegotiationneeded");
});
