/// <reference lib="dom" />

declare module "wrtc/build/Release/wrtc.node" {
  const RTCPeerConnection: {
    prototype: RTCPeerConnection;
    new (configuration?: RTCConfiguration): RTCPeerConnection;
    generateCertificate(
      keygenAlgorithm: AlgorithmIdentifier
    ): Promise<RTCCertificate>;
    getDefaultIceServers(): RTCIceServer[];
  };
}
