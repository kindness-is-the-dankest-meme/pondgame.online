const validTiles = [
  "│",
  "─",
  "╯",
  "╭",
  "╰",
  "╮",
] as const;
type Tile = typeof validTiles[number];

const makeDrawTile = (s: number) => {
  const hs = s / 2;

  return (tile: Tile, i = 0, j = 0) => ({
    "╯": `M ${j * s + hs},${i * s} A ${hs},${hs} 90,0,1 ${j * s},${i * s + hs}`,
    "╰": `M ${j * s + s},${i * s + hs} A ${hs},${hs} 90,0,1 ${j * s + hs},${
      i * s
    }`,
    "╭": `M ${j * s + hs},${i * s + s} A ${hs},${hs} 90,0,1 ${j * s + s},${
      i * s + hs
    }`,
    "╮": `M ${j * s},${i * s + hs} A ${hs},${hs} 90,0,1 ${j * s + hs},${
      i * s + s
    }`,
    "─": `M ${j * s},${i * s + hs} H ${j * s + s}`,
    "│": `M ${j * s + hs},${i * s} V ${i * s + s}`,
  }[tile] + " ");
};

export const useTiles = (s: number): [
  (tile: Tile, i?: number, j?: number) => string,
  (x: string) => x is Tile,
] => [
  makeDrawTile(s),
  (x: string): x is Tile => validTiles.includes(x as Tile),
];
