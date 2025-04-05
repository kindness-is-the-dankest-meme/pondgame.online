import { defineApp } from "$fresh/server.ts";

export default defineApp((_req, { Component }) => (
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>pondgame.online</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <Component />
    </body>
  </html>
));
