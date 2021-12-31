export class RTCPeerConnectionIceErrorEvent extends Event {
  readonly address: string | null;
  readonly errorCode: number;
  readonly errorText: string;
  readonly port: number | null;
  readonly url: string;

  constructor(type: string, eventInit: RTCPeerConnectionIceErrorEventInit) {
    const {
      bubbles,
      cancelable,
      composed,
      address,
      errorCode,
      errorText,
      port,
      url,
    } = eventInit;

    super(type, { bubbles, cancelable, composed });

    this.address = address ?? null;
    this.errorCode = errorCode;
    this.errorText = errorText ?? "";
    this.port = port ?? null;
    this.url = url ?? "";
  }
}
