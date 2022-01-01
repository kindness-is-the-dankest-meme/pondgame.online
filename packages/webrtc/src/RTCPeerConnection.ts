import { NativeRTCPeerConnection } from "./binding.js";
import { createEventTarget } from "./createEventTarget.js";

export const RTCPeerConnection = createEventTarget<
  typeof globalThis.RTCPeerConnection,
  globalThis.RTCPeerConnectionEventMap & {
    [eventType: string]: Event;
  }
>(NativeRTCPeerConnection, {
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
