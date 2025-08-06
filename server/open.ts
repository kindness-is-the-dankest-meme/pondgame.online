export const open = (path: URL) =>
  Deno.open(path, { read: true }).then(({ readable }) => readable);
