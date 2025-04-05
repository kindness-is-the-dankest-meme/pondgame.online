import { bundle } from "jsr:@deno/emit";

export const compiled = (path: URL) => bundle(path).then(({ code }) => code);

// import { transform } from "esbuild-wasm";

// export const compiled = (path: URL) =>
//   Deno.readTextFile(path)
//     .then((source) => transform(source, { loader: "ts" }))
//     .then(({ code }) => code.replace(/"(\..*)\.ts"/g, '"$1.js"'));
