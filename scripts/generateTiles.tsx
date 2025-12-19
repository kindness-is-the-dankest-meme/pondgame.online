import { renderToStaticMarkup } from "react-dom/server";

type T =
  | "∙" // 0x00 a
  | "▝" // 0x01 b
  | "▘" // 0x02 c
  | "▀" // 0x03 d
  | "▖" // 0x04 e
  | "▞" // 0x05 f
  | "▌" // 0x06 g
  | "▛" // 0x07 h
  | "▗" // 0x08 i
  | "▐" // 0x09 j
  | "▚" // 0x0A k
  | "▜" // 0x0B l
  | "▄" // 0x0C m
  | "▟" // 0x0D n
  | "▙" // 0x0E o
  | "█" // 0x0F p
  | "╱" // 0x15 q // u // v
  | "╲"; // 0x1A r // z // A

const paths = (s: number): [T, string][] => {
  const h = s / 2,
    a = (x: number, y: number, f: 0 | 1 = 1) =>
      `A ${h} ${h} 0 0 ${f} ${x} ${y}`,
    mh = (x: number, y: number, h: number) => `M ${x} ${y} H ${h}`,
    mv = (x: number, y: number, v: number) => `M ${x} ${y} V ${v}`,
    nw = `${mh(0, 0, h)} ${a(0, h)}`,
    ne = `${mv(s, 0, h)} ${a(h, 0)}`,
    se = `${mh(s, s, h)} ${a(s, h)}`,
    sw = `${mv(0, s, h)} ${a(h, s)}`;

  return [
    ["∙", ""],
    ["▝", `${ne} Z`],
    ["▘", `${nw} Z`],
    ["▀", `${mh(0, 0, s)} V ${h} H 0 Z`],
    ["▖", `${sw} Z`],
    ["▞", `${ne} Z ${sw} Z`],
    ["▌", `${mh(0, 0, h)} V ${s} H 0 Z`],
    ["▛", `${mv(0, s, 0)} H ${s} V ${h} ${a(h, s, 0)} Z`],
    ["▗", `${se} Z`],
    ["▐", `${mh(h, 0, s)} V ${s} H ${h} Z`],
    ["▚", `${nw} Z ${se} Z`],
    ["▜", `${mh(0, 0, s)} V ${s} H ${h} ${a(0, h, 0)} Z`],
    ["▄", `${mv(s, h, s)} H 0 V ${h} Z`],
    ["▟", `${mv(s, 0, s)} H 0 V ${h} ${a(h, 0, 0)} Z`],
    ["▙", `${mh(s, s, 0)} V 0 H ${h} ${a(s, h, 0)} Z`],
    ["█", `${mh(0, 0, s)} V ${s} H 0 Z`],
    ["╱", `${mv(s, 0, h)} ${a(h, s, 0)} H 0 V ${h} ${a(h, 0, 0)} Z`],
    ["╲", `${mh(0, 0, h)} ${a(s, h, 0)} V ${s} H ${h} ${a(0, h, 0)} Z`],
  ];
};

const s = 32;

Promise.all(
  paths(s).map(([t, d]) =>
    Deno.writeTextFile(
      `${Deno.cwd()}/public/${t}.svg`,
      renderToStaticMarkup(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${s} ${s}`}>
          <g>
            <rect width={s} height={s} fill="black" opacity="0" />
            {d && <path d={d} fill="white" />}
          </g>
        </svg>
      )
    )
  )
).finally(() => Deno.exit());
