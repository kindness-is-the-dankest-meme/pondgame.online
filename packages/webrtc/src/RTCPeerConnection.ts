import { NativeRTCPeerConnection } from "./binding.js";
import { RTCDataChannelEvent } from "./RTCDataChannelEvent.js";
import { RTCIceCandidate } from "./RTCIceCandidate.js";
import { RTCPeerConnectionIceErrorEvent } from "./RTCPeerConnectionIceErrorEvent.js";
import { RTCTrackEvent } from "./RTCTrackEvent.js";

/**
 * this seems to need to be here to override the `lib.dom.d.ts` version, for
 * some reason the `RTCTrackEvent` types are incompatible (maybe others)
 */
interface RTCPeerConnectionEventMap {
  connectionstatechange: Event;
  datachannel: RTCDataChannelEvent;
  icecandidate: RTCPeerConnectionIceEvent;
  icecandidateerror: Event;
  iceconnectionstatechange: Event;
  icegatheringstatechange: Event;
  negotiationneeded: Event;
  signalingstatechange: Event;
  track: RTCTrackEvent;
}

const rtcPeerConnectionEventTypes: (keyof RTCPeerConnectionEventMap)[] = [
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

const isRTCPeerConnectionEventType = (
  type: string
): type is keyof RTCPeerConnectionEventMap =>
  (rtcPeerConnectionEventTypes as string[]).includes(type);

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
      event: RTCPeerConnectionEventMap[K]
    ) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof RTCPeerConnectionEventMap>(
    type: K,
    listener: (
      this: RTCPeerConnection,
      event: RTCPeerConnectionEventMap[K]
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

    // onconnectionstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
    this.#nativeRTCPeerConnection.onconnectionstatechange = () =>
      this.dispatchEvent(new Event("connectionstatechange"));

    // ondatachannel: ((this: RTCPeerConnection, event: RTCDataChannelEvent) => any) | null;
    this.#nativeRTCPeerConnection.ondatachannel = (channel: RTCDataChannel) =>
      this.dispatchEvent(new RTCDataChannelEvent("datachannel", { channel }));

    // onicecandidate: ((this: RTCPeerConnection, event: RTCPeerConnectionIceEvent) => any) | null;
    this.#nativeRTCPeerConnection.onicecandidate = (
      partialCandidate: Partial<RTCIceCandidate>
    ) =>
      this.dispatchEvent(
        new RTCPeerConnectionIceEvent("icecandidate", {
          candidate: new RTCIceCandidate(partialCandidate),
        })
      );

    // onicecandidateerror: ((this: RTCPeerConnection, event: Event) => any) | null;
    this.#nativeRTCPeerConnection.onicecandidateerror = (
      eventInit: Omit<
        RTCPeerConnectionIceErrorEventInit,
        "address" | "port"
      > & { hostCandidate: string }
    ) => {
      const { hostCandidate, errorCode, errorText, url } = eventInit;
      const [address, port] = hostCandidate.split(":");

      this.dispatchEvent(
        new RTCPeerConnectionIceErrorEvent("icecandidateerror", {
          address,
          errorCode,
          errorText,
          port: port ? parseInt(port, 10) : null,
          url,
        })
      );
    };

    // oniceconnectionstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
    this.#nativeRTCPeerConnection.oniceconnectionstatechange = (event: Event) =>
      this.dispatchEvent(new Event("iceconnectionstatechange"));

    // onicegatheringstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
    this.#nativeRTCPeerConnection.onicegatheringstatechange = (event: Event) =>
      this.dispatchEvent(new Event("icegatheringstatechange"));

    // onnegotiationneeded: ((this: RTCPeerConnection, event: Event) => any) | null;
    this.#nativeRTCPeerConnection.onnegotiationneeded = () =>
      this.dispatchEvent(new Event("negotiationneeded"));

    // onsignalingstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
    this.#nativeRTCPeerConnection.onsignalingstatechange = () =>
      this.dispatchEvent(new Event("signalingstatechange"));

    // ontrack: ((this: RTCPeerConnection, event: RTCTrackEvent) => any) | null;
    this.#nativeRTCPeerConnection.ontrack = (
      receiver: RTCRtpReceiver,
      streams: MediaStream[],
      transceiver: RTCRtpTransceiver
    ) => {
      const { track } = receiver;

      this.dispatchEvent(
        new RTCTrackEvent("track", { receiver, streams, track, transceiver })
      );
    };
  }

  // onconnectionstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
  onconnectionstatechange:
    | ((this: RTCPeerConnection, event: Event) => any)
    | null = null;

  // ondatachannel: ((this: RTCPeerConnection, event: RTCDataChannelEvent) => any) | null;
  ondatachannel:
    | ((this: RTCPeerConnection, event: RTCDataChannelEvent) => any)
    | null = null;

  // onicecandidate: ((this: RTCPeerConnection, event: RTCPeerConnectionIceEvent) => any) | null;
  onicecandidate:
    | ((this: RTCPeerConnection, event: RTCPeerConnectionIceEvent) => any)
    | null = null;

  // onicecandidateerror: ((this: RTCPeerConnection, event: Event) => any) | null;
  onicecandidateerror: ((this: RTCPeerConnection, event: Event) => any) | null =
    null;

  // oniceconnectionstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
  oniceconnectionstatechange:
    | ((this: RTCPeerConnection, event: Event) => any)
    | null = null;

  // onicegatheringstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
  onicegatheringstatechange:
    | ((this: RTCPeerConnection, event: Event) => any)
    | null = null;

  // onnegotiationneeded: ((this: RTCPeerConnection, event: Event) => any) | null;
  onnegotiationneeded: ((this: RTCPeerConnection, event: Event) => any) | null =
    null;

  // onsignalingstatechange: ((this: RTCPeerConnection, event: Event) => any) | null;
  onsignalingstatechange:
    | ((this: RTCPeerConnection, event: Event) => any)
    | null = null;

  // ontrack: ((this: RTCPeerConnection, event: RTCTrackEvent) => any) | null;
  ontrack: ((this: RTCPeerConnection, event: RTCTrackEvent) => any) | null =
    null;

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
    dataChannelInit?: RTCDataChannelInit
  ): RTCDataChannel {
    return this.#nativeRTCPeerConnection.createDataChannel(
      label,
      dataChannelInit
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

  /**
   * override `dispatchEvent` to make sure we also call any event listeners
   * registered via `on${event.type}` callbacks
   */
  dispatchEvent(
    event:
      | Event
      | RTCDataChannelEvent
      | RTCPeerConnectionIceEvent
      | RTCTrackEvent
  ): boolean {
    if (
      isRTCPeerConnectionEventType(event.type) &&
      typeof this[`on${event.type}`] === "function"
    ) {
      this[`on${event.type}`]?.(
        /**
         * `event as RTCPeerConnectionEventMap[event.type]` seems like what I
         * want, but it winds up creating an `Event & RTCDataChannelEvent &
         * RTCPeerConnectionIceEvent & RTCTrackEvent` type
         */
        event as any
      );
    }

    return super.dispatchEvent(event);
  }
}
