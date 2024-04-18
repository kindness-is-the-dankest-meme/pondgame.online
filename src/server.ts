const res = (body?: BodyInit | null, init?: ResponseInit) =>
  new Response(body, init);

const url = (url: string | URL, base?: string | URL | undefined) =>
  new URL(url, base);

const streamFile = async (path: string) =>
  (await Deno.open(url(path, import.meta.url), { read: true })).readable;

const upgradeWebSocket = (req: Request) => {
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    socket.send("Hello");
  });

  return response;
};

Deno.serve(async (req) =>
  (req.headers.get("upgrade") || "").toLowerCase() === "websocket"
    ? upgradeWebSocket(req)
    : res(await streamFile("index.html"))
);
