import { parse } from "@std/path/parse";
import { furl } from "./furl.ts";

export const prse = (path: string) =>
  parse(decodeURIComponent(furl(path).pathname));
