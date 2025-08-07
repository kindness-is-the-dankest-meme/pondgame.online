export const Exts = {
  Css: ".css",
  Html: ".html",
  Js: ".js",
  Ts: ".ts",
} as const;

const MIME_TYPE = {
  [Exts.Css]: "text/css",
  [Exts.Html]: "text/html",
  [Exts.Js]: "text/javascript",
} as const;

export const type = (ext: keyof typeof MIME_TYPE) =>
  `${MIME_TYPE[ext]}; charset=utf-8`;
