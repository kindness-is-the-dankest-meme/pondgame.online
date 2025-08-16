import { Exts } from "./Exts.ts";
import { frmt } from "./frmt.ts";
import { prse } from "./prse.ts";

export const mapf = (path: string, fs: Set<string>) => {
  const parsed = prse(path),
    { dir } = parsed;
  let { ext, name } = parsed;

  if (ext === ".js") {
    if (fs.has(frmt(dir, name, Exts.Ts))) ext = ".ts";
    if (fs.has(frmt(dir, name, Exts.Tsx))) ext = ".tsx";
  }

  if (name === "" && ext === "") {
    ext = ".html";
    name = "index";
  }

  return {
    dir,
    ext,
    name,
  };
};
