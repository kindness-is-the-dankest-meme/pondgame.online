import { Evt } from "evt";

import { shared } from "@kitdm/pondgame.shared";
console.log({ shared });

const {
  devicePixelRatio: dpr,
  // requestAnimationFrame: raf,
  // cancelAnimationFrame: caf,
} = window;

const el = <E extends Element = Element>(selectors: string): E | null =>
  document.querySelector(selectors);

const search = (params: Record<string, string>): URLSearchParams =>
  new URLSearchParams(params);

const href = (url: string, params?: Record<string, string>): string =>
  new URL(`${url}${params ? `?${search(params)}` : ""}`).href;

const createWebSocket = (
  url: string,
  params?: Record<string, string>
): WebSocket => new WebSocket(href(url, params));

const canvas = el<HTMLCanvasElement>("canvas");
if (!canvas) {
  throw new Error("Expected an HTMLCanvasElement, but found none");
}

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Expected a CanvasRenderingContext2D, but found none");
}

const webSocket = createWebSocket("ws://localhost:8080");
Evt.from<MessageEvent<string>>(webSocket, "message").attach((message) => {
  console.log(message);
  webSocket.send("hello from client");
});

/**
 * Window Resizing
 */
Evt.from<Event>(window, "resize").attach(() => {
  const { innerWidth, innerHeight } = window;

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.style.transform = `scale(${1 / dpr})`;
});

window.dispatchEvent(new Event("resize"));
