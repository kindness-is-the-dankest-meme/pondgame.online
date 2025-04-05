import { STATUS_TEXT, type StatusCode } from "jsr:@std/http/status";

type F<T> = T extends new (...args: infer A) => infer R
  ? (...args: A) => R
  : never;

export const url: F<typeof URL> = (url, base) => new URL(url, base);

export const response: F<typeof Response> = (body, init) =>
  new Response(body, init);

export const statusResponse = (code: StatusCode) =>
  response(`${code} ${STATUS_TEXT[code]}`, {
    status: code,
    statusText: STATUS_TEXT[code],
  });

export const readable = (path: URL) =>
  Deno.open(path, { read: true }).then(({ readable }) => readable);

export const EXT = {
  Css: ".css",
  Html: ".html",
  Js: ".js",
  Ts: ".ts",
} as const;

export type Ext = (typeof EXT)[keyof typeof EXT];

export const CONTENT_TYPE = {
  [EXT.Css]: "text/css",
  [EXT.Html]: "text/html",
  [EXT.Js]: "text/javascript",
  [EXT.Ts]: "text/javascript",
} as const;
