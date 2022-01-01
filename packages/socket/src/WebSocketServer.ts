import type { Server } from "http";

interface WebSocketServerOptions {
  server: Server;
}

export class WebSocketServer extends EventTarget {
  #server: Server;

  constructor({ server }: WebSocketServerOptions) {
    super();
    this.#server = server;
  }
}
