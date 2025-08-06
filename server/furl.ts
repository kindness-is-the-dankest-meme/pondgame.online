import type { F } from "../types.ts";

export const furl: F<typeof URL> = (url, base) => new URL(url, base);
