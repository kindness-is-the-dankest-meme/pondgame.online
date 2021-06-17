import { shell } from "@sinclair/hammer";

declare global {
  interface Global {
    shell: typeof shell;
  }
}

export async function dev() {
  await shell([
    "hammer serve apps/client/src/index.html --dist apps/client/dist --port 8000",
    // `hammer monitor apps/server/src/index.ts "${[
    //   "esbuild",
    //   "apps/server/src/index.ts",
    //   "--platform=node",
    //   "--target=esnext",
    //   "--format=esm",
    //   "--external:http",
    //   "--bundle",
    //   "--outfile=apps/server/dist/index.js",
    // ].join(" ")}"`,
    // `hammer monitor apps/server/dist/index.js "node apps/server/dist/index.js"`,
    "hammer run apps/server/src/index.ts --dist apps/server/dist",
  ]);
}
