const res = (body?: BodyInit | null, init?: ResponseInit) =>
  new Response(body, init);

const url = (url: string | URL, base?: string | URL | undefined) =>
  new URL(url, base);

const openReadable = (path: string) =>
  Deno.open(url(path, import.meta.url), { read: true }).then(
    (file) => file.readable
  );

const upgradeWebSocket = (req: Request) => {
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    socket.send("Hello");
  });

  return response;
};

const serveFile = async (req: Request) => {
  const path = decodeURIComponent(url(req.url).pathname);
  console.log(url(`.${path}`, import.meta.url), path);

  try {
    const file = await Deno.open(url(`.${path}`, import.meta.url), {
      read: true,
    });
    return res(file.readable);
  } catch (error) {
    console.error(error);
    return res("Not Found", { status: 404 });
  }
};

Deno.serve((req) =>
  req.headers.get("upgrade")?.toLowerCase() === "websocket"
    ? upgradeWebSocket(req)
    : serveFile(req)
);
