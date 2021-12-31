export class RTCDataChannelEvent extends Event {
  readonly channel: RTCDataChannel;

  constructor(type: string, eventInit: RTCDataChannelEventInit) {
    const { bubbles, cancelable, composed, channel } = eventInit;

    super(type, {
      bubbles,
      cancelable,
      composed,
    });

    this.channel = channel;
  }
}
