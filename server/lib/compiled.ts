import { transform } from "esbuild";

export const compiled = (path: URL) =>
  Deno.readTextFile(path)
    .then((source) => transform(source, { loader: "ts" }))
    .then(({ code }) => code.replace(/"(\..*)\.ts"/g, '"$1.js"'));
