const validCels = [
  "│",
  "─",
  "╯",
  "╭",
  "╰",
  "╮",
] as const;
type Cel = typeof validCels[number];

export const generateDraw = (size: number) => {
  const halfSize = size / 2;

  return [
    (cel: Cel, i = 0, j = 0) => ({
      "╯": `M ${j * size + halfSize},${
        i * size
      } A ${halfSize},${halfSize} 90,0,1 ${j * size},${i * size + halfSize}`,
      "╰": `M ${j * size + size},${
        i * size + halfSize
      } A ${halfSize},${halfSize} 90,0,1 ${j * size + halfSize},${i * size}`,
      "╭": `M ${j * size + halfSize},${
        i * size + size
      } A ${halfSize},${halfSize} 90,0,1 ${j * size + size},${
        i * size + halfSize
      }`,
      "╮": `M ${j * size},${
        i * size + halfSize
      } A ${halfSize},${halfSize} 90,0,1 ${j * size + halfSize},${
        i * size + size
      }`,
      "─": `M ${j * size},${i * size + halfSize} H ${j * size + size}`,
      "│": `M ${j * size + halfSize},${i * size} V ${i * size + size}`,
    }[cel] + " "),
    (x: string): x is Cel => validCels.includes(x as Cel),
  ] as const;
};
