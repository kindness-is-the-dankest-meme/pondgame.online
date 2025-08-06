import type { F } from "../types.ts";

export const fres: F<typeof Response> = (body, init) =>
  new Response(body, init);
