export class RTCPeerConnectionIceEvent extends Event {
  readonly candidate: RTCIceCandidate | null = null;
  readonly url: string | null = null;

  constructor(type: string, eventInit: RTCPeerConnectionIceEventInit) {
    const { bubbles, cancelable, composed, candidate, url } = eventInit;

    super(type, {
      bubbles,
      cancelable,
      composed,
    });

    this.candidate = candidate ?? null;
    this.url = url ?? null;
  }
}
