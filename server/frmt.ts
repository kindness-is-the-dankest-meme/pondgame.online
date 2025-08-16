import { format } from "jsr:@std/path/format";
import { join } from "jsr:@std/path/join";
import { normalize } from "jsr:@std/path/normalize";
import { type ParsedPath } from "jsr:@std/path/parse";

export const frmt = (
  dir: ParsedPath["dir"],
  name: ParsedPath["name"],
  ext: ParsedPath["ext"]
) =>
  normalize(
    format({
      root: "/",
      dir: join("public", dir),
      base: name + ext,
      ext,
      name,
    })
  );
