export const open = (url: URL) =>
  Deno.open(url, { read: true }).then(({ readable }) => readable);
