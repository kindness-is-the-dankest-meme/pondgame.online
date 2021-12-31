export class RTCTrackEvent extends Event {
  readonly receiver: RTCRtpReceiver;
  readonly streams?: ReadonlyArray<MediaStream>;
  readonly track: MediaStreamTrack;
  readonly transceiver: RTCRtpTransceiver;

  constructor(type: string, eventInit: RTCTrackEventInit) {
    const {
      bubbles,
      cancelable,
      composed,
      receiver,
      streams,
      track,
      transceiver,
    } = eventInit;

    super(type, {
      bubbles,
      cancelable,
      composed,
    });

    this.receiver = receiver;
    this.streams = streams;
    this.track = track;
    this.transceiver = transceiver;
  }
}
