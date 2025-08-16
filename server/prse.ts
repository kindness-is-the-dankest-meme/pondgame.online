import { parse } from "jsr:@std/path/parse";
import { furl } from "./furl.ts";

export const prse = (path: string) =>
  parse(decodeURIComponent(furl(path).pathname));
