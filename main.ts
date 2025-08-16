import { Exts } from "./server/Exts.ts";
import { fres } from "./server/fres.ts";
import { frmt } from "./server/frmt.ts";
import { furl } from "./server/furl.ts";
import { mapf } from "./server/mapf.ts";
import { mime } from "./server/mime.ts";
import { open } from "./server/open.ts";
import { prod } from "./server/prod.ts";
import { stat } from "./server/stat.ts";
import { tsfm } from "./server/tsfm.ts";
import { walk } from "./server/walk.ts";

const fs = new Set(await Array.fromAsync(walk("public", Deno.mainModule)));

Deno.serve(async ({ url }) => {
  const { dir, ext, name } = mapf(url, fs),
    path = frmt(dir, name, ext);

  if (!dir.startsWith("/")) return stat(403);
  if (!fs.has(path)) return stat(404);

  try {
    switch (ext) {
      case Exts.Css:
      case Exts.Html: {
        return fres(await open(furl(path, Deno.mainModule)), {
          headers: { "Content-Type": mime(ext) },
        });
      }

      case Exts.Ts:
      case Exts.Tsx: {
        return fres(await tsfm(furl(path, Deno.mainModule)), {
          headers: { "Content-Type": mime(Exts.Js) },
        });
      }
    }
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error(error);

    return prod ? stat(500) : stat(404);
  }

  return stat(501);
});
