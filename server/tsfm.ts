import initSwc, {
  type Options,
  transform,
} from "https://esm.sh/@swc/wasm-web@1.13.3";

const prod = Deno.env.has("DENO_DEPLOYMENT_ID");
const opts: Options = {
  envName: prod ? "production" : "development",
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    // @ts-expect-error these types are just not up to date
    target: "es2024",
    loose: false,
    minify: {
      compress: prod,
      mangle: prod,
      module: true,
    },
  },
  module: {
    type: "es6",
  },
  minify: false,
  isModule: true,
};

await initSwc();
export const tsfm = (url: URL) =>
  Deno.readTextFile(url)
    .then((code) => transform(code, opts))
    .then(({ code }) => code);
