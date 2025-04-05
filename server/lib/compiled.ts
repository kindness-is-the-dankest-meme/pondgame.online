import { bundle } from "jsr:@deno/emit";

export const compiled = (path: URL) => bundle(path).then(({ code }) => code);
