import { createRequire } from "module";
import { resolve } from "path";

/**
 * I prefer to keep `"type": "module"` in the `package.json` file, but the
 * `require` semantics are required for loading Node addons
 *
 * @see https://stackoverflow.com/a/66527729/1577876
 */
export const {
  RTCPeerConnection: NativeRTCPeerConnection,
  RTCDataChannel: NativeRTCDataChannel,
} = createRequire(resolve(process.cwd(), "node_modules"))(
  "wrtc/build/Release/wrtc.node"
);
