import { prse } from "./prse.ts";

export const mapf = (path: string) => {
  const parsed = prse(path),
    { dir } = parsed;
  let { ext, name } = parsed;

  if (ext === ".js") {
    ext = ".ts";
  }

  if (name === "") {
    ext = ".html";
    name = "index";
  }

  return {
    dir,
    ext,
    name,
  };
};
