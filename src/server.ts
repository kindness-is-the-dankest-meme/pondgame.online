import { STATUS_TEXT, type StatusCode } from "std/http/mod.ts";
import { format, type ParsedPath, parse } from "std/path/mod.ts";
import { bundle } from "emit";
import { state } from "./lib/state.ts";

const url = (url: string | URL): URL => new URL(url, import.meta.url);

const res = (body?: BodyInit | null, init?: ResponseInit): Response =>
  new Response(body, init);

const status = (code: StatusCode): string => `${code} ${STATUS_TEXT[code]}`;

const handleUpgrade = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    socket.send(JSON.stringify(state.getState(), null, 2));
  });

  return response;
};

// index, client, worker
const handleRequest = async (req: Request): Promise<Response> => {
  const parsedPath: ParsedPath = parse(
    decodeURIComponent(url(req.url).pathname)
  );

  switch (parsedPath.name) {
    case "":
    case "index": {
      parsedPath.name = "index";
      parsedPath.ext = ".html";
      break;
    }

    case "client":
    case "worker": {
      parsedPath.ext = ".ts";
      break;
    }
  }

  parsedPath.dir = ".";
  parsedPath.base = `${parsedPath.name}${parsedPath.ext}`;
  const formatted = format(parsedPath);

  switch (parsedPath.ext) {
    case ".html": {
      const { readable } = await Deno.open(url(formatted), {
        read: true,
      });

      return res(readable);
    }

    case ".ts": {
      const { code } = await bundle(url(formatted), {
        importMap: url("../importMap.json"),
      });
      return res(code, {
        headers: {
          "Content-Type": "text/javascript",
        },
      });
    }
  }

  return res(status(404), { status: 404 });
};

Deno.serve((req) =>
  (req.headers.get("upgrade")?.toLowerCase() === "websocket"
    ? handleUpgrade
    : handleRequest)(req)
);
