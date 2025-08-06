import { fres } from "./server/fres.ts";
import { frmt } from "./server/frmt.ts";
import { furl } from "./server/furl.ts";
import { mapf } from "./server/mapf.ts";
import { Exts, type } from "./server/mime.ts";
import { open } from "./server/open.ts";
import { stat } from "./server/stat.ts";
import { walk } from "./server/walk.ts";

const fs = await Array.fromAsync(walk("public", Deno.mainModule));

Deno.serve(async ({ url }) => {
  const { dir, ext, name } = mapf(url),
    path = frmt({ dir, name, ext });

  if (!dir.startsWith("/")) return stat(403);
  if (!fs.includes(path)) return stat(404);

  switch (ext) {
    case Exts.Css:
    case Exts.Html: {
      return fres(await open(furl(path, Deno.mainModule)), {
        headers: { "Content-Type": type(ext) },
      });
    }
  }

  return stat(501);
});
