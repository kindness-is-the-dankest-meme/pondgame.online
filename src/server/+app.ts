import { html } from "client:page";

export default {
  fetch(req: Request) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(html, { headers: { "content-type": "text/html" } });
    }

    return new Response("Not found", { status: 404 });
  },
};
