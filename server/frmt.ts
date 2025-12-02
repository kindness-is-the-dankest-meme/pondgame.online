import { format } from "@std/path/format";
import { join } from "@std/path/join";
import { normalize } from "@std/path/normalize";
import { type ParsedPath } from "@std/path/parse";

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
