import { createServer } from "http";

import { Evt } from "evt";
import WebSocket, { MessageEvent, Server, ServerOptions } from "ws";

import { shared } from "@kitdm/pondgame.shared";
console.log({ shared });

const createSocketServer = (
  options?: ServerOptions,
  callback?: () => void
): Server => new Server(options, callback);

const server = createServer();
const socketServer = createSocketServer({ server });

Evt.from<WebSocket>(socketServer, "connection").attach((socket) => {
  console.log("connection");
  socket.send("hello from server");

  Evt.from<MessageEvent>(socket, "message").attach((message) => {
    console.log(message);
  });
});

server.listen(8080);
