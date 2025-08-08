import { format, join, normalize, type ParsedPath } from "jsr:@std/path";

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
