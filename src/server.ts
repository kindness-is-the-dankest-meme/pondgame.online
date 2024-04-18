const res = (body?: BodyInit | null, init?: ResponseInit) =>
  new Response(body, init);

Deno.serve(() => res("Hello"));
