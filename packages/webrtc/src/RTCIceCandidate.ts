export class RTCIceCandidate {
  readonly address: string | null;
  readonly candidate: string;
  readonly component: RTCIceComponent | null;
  readonly foundation: string | null;
  readonly port: number | null;
  readonly priority: number | null;
  readonly protocol: RTCIceProtocol | null;
  readonly relatedAddress: string | null;
  readonly relatedPort: number | null;
  readonly sdpMLineIndex: number | null;
  readonly sdpMid: string | null;
  readonly tcpType: RTCIceTcpCandidateType | null;
  readonly type: RTCIceCandidateType | null;
  readonly usernameFragment: string | null;

  constructor({
    address,
    candidate,
    component,
    foundation,
    port,
    priority,
    protocol,
    relatedAddress,
    relatedPort,
    sdpMLineIndex,
    sdpMid,
    tcpType,
    type,
    usernameFragment,
  }: Partial<RTCIceCandidate>) {
    this.address = address ?? null;
    this.candidate = candidate ?? "";
    this.component = component ?? null;
    this.foundation = foundation ?? null;
    this.port = port ?? null;
    this.priority = priority ?? null;
    this.protocol = protocol ?? null;
    this.relatedAddress = relatedAddress ?? null;
    this.relatedPort = relatedPort ?? null;
    this.sdpMLineIndex = sdpMLineIndex ?? null;
    this.sdpMid = sdpMid ?? null;
    this.tcpType = tcpType ?? null;
    this.type = type ?? null;
    this.usernameFragment = usernameFragment ?? null;
  }

  toJSON(): RTCIceCandidateInit {
    const { candidate, sdpMLineIndex, sdpMid, usernameFragment } = this;

    return {
      candidate,
      sdpMLineIndex,
      sdpMid,
      usernameFragment,
    };
  }
}
