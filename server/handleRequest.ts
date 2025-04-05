import { format, parse } from "jsr:@std/path";
import {
  CONTENT_TYPE,
  EXT,
  readable,
  response,
  statusResponse,
  url,
} from "./lib/utils.ts";
import { walk } from "./lib/walk.ts";
import { compiled } from "./lib/compiled.ts";

const publicFiles = await Array.fromAsync(walk("public", Deno.mainModule));

export const handleRequest = async (req: Request): Promise<Response> => {
  const parsed = parse(decodeURIComponent(url(req.url).pathname));
  let { dir, ext, name } = parsed;

  if (dir !== "/") return statusResponse(403);

  if (ext === EXT.Js) {
    ext = EXT.Ts;
  }

  if (name === "") {
    name = "index";
    ext = EXT.Html;
  }

  const path = format({
    base: name + ext,
    dir: "public",
    ext,
    name,
    root: "/",
  });

  if (!publicFiles.includes(path)) return statusResponse(404);

  switch (ext) {
    case EXT.Html:
    case EXT.Css: {
      return response(await readable(url(path, Deno.mainModule)), {
        headers: { "Content-Type": CONTENT_TYPE[ext] },
      });
    }

    case EXT.Ts: {
      return response(await compiled(url(path, Deno.mainModule)), {
        headers: { "Content-Type": CONTENT_TYPE[ext] },
      });
    }
  }

  return statusResponse(500);
};
