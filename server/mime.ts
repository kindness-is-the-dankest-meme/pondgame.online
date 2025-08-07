import { Exts } from "./Exts.ts";

const MIME_TYPE = {
  [Exts.Css]: "text/css",
  [Exts.Html]: "text/html",
  [Exts.Js]: "text/javascript",
} as const;

export const mime = (ext: keyof typeof MIME_TYPE) =>
  `${MIME_TYPE[ext]}; charset=utf-8`;
