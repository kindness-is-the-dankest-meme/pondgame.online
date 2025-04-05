import { join } from "jsr:@std/path";
import { url } from "./utils.ts";

export async function* walk(dir: string, base: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(url(dir, base))) {
    if (entry.isDirectory) {
      yield* walk(join(dir, entry.name), base);
    }

    if (entry.isFile) {
      yield join(dir, entry.name);
    }
  }
}
