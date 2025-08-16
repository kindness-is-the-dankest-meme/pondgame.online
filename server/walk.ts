import { join } from "jsr:@std/path/join";
import { furl } from "./furl.ts";

export const walk = async function* (
  dir: string,
  base: string
): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(furl(dir, base))) {
    if (entry.isDirectory) {
      yield* walk(join(dir, entry.name), base);
    }

    if (entry.isFile) {
      yield join(dir, entry.name);
    }
  }
};
