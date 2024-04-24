import { STATUS_TEXT, type StatusCode } from "std/http/mod.ts";
import { format, type ParsedPath, parse } from "std/path/mod.ts";
import { bundle } from "emit";

const url = (url: string | URL, base?: string | URL | undefined): URL =>
  new URL(url, base);

const res = (body?: BodyInit | null, init?: ResponseInit): Response =>
  new Response(body, init);

const status = (code: StatusCode): string => `${code} ${STATUS_TEXT[code]}`;

const handleUpgrade = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    socket.send("Hello");
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

  switch (parsedPath.ext) {
    case ".html": {
      const { readable } = await Deno.open(
        url(format(parsedPath), import.meta.url),
        { read: true }
      );

      return res(readable);
    }
    case ".ts": {
      const { code } = await bundle(url(format(parsedPath), import.meta.url));
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
