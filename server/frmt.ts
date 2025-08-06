import { format, join, normalize, type ParsedPath } from "jsr:@std/path";

export const frmt = ({
  dir,
  name,
  ext,
}: Pick<ParsedPath, "dir" | "name" | "ext">) =>
  normalize(
    format({
      root: "/",
      dir: join("public", dir),
      base: name + ext,
      ext,
      name,
    })
  );
