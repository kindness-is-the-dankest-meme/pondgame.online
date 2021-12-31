import { createRequire } from "module";
import { resolve } from "path";

/**
 * I prefer to keep `"type": "module"` in the `package.json` file, but we need
 * `require` semantics for loading addons
 *
 * @see https://stackoverflow.com/a/66527729/1577876
 */
let wrtc;
try {
  wrtc = createRequire(resolve(process.cwd(), "node_modules"))(
    "wrtc/build/Debug/wrtc.node"
  );
} catch (e) {
  wrtc = createRequire(resolve(process.cwd(), "node_modules"))(
    "wrtc/build/Release/wrtc.node"
  );
}

export const { RTCPeerConnection: NativeRTCPeerConnection, RTCDataChannel } =
  wrtc;
