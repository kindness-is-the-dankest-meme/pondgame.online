import { renderToStaticMarkup } from "react-dom/server";

type T =
  | "00" //  ∙  // 0b00000000  //  "00"  //  0
  | "02" //  ▖  // 0b00000010  //  "02"  //  1
  | "08" //  ▗  // 0b00001000  //  "08"  //  2
  | "0f" //  ▄  // 0b00001111  //  "0f"  //  3
  | "20" //  ▝  // 0b00100000  //  "20"  //  4
  | "22" //  ▞  // 0b00100010  //  "22"  //  5
  | "3c" //  ▐  // 0b00111100  //  "3c"  //  6
  | "77" //  ╱  // 0b01110111  //  "77"  //  7
  | "7f" //  ▟  // 0b01111111  //  "7f"  //  8
  | "80" //  ▘  // 0b10000000  //  "80"  //  9
  | "88" //  ▚  // 0b10001000  //  "88"  //  a
  | "c3" //  ▌  // 0b11000011  //  "c3"  //  b
  | "dd" //  ╲  // 0b11011101  //  "dd"  //  c
  | "df" //  ▙  // 0b11011111  //  "df"  //  d
  | "f0" //  ▀  // 0b11110000  //  "f0"  //  e
  | "f7" //  ▛  // 0b11110111  //  "f7"  //  f
  | "fd" //  ▜  // 0b11111101  //  "fd"  //  g
  | "ff"; // █  // 0b11111111  //  "ff"  //  h

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
    ["00", ""],
    ["02", `${sw} Z`],
    ["08", `${se} Z`],
    ["0f", `${mv(s, h, s)} H 0 V ${h} Z`],
    ["20", `${ne} Z`],
    ["22", `${ne} Z ${sw} Z`],
    ["3c", `${mh(h, 0, s)} V ${s} H ${h} Z`],
    ["77", `${mv(s, 0, h)} ${a(h, s, 0)} H 0 V ${h} ${a(h, 0, 0)} Z`],
    ["7f", `${mv(s, 0, s)} H 0 V ${h} ${a(h, 0, 0)} Z`],
    ["80", `${nw} Z`],
    ["88", `${nw} Z ${se} Z`],
    ["c3", `${mh(0, 0, h)} V ${s} H 0 Z`],
    ["dd", `${mh(0, 0, h)} ${a(s, h, 0)} V ${s} H ${h} ${a(0, h, 0)} Z`],
    ["df", `${mh(s, s, 0)} V 0 H ${h} ${a(s, h, 0)} Z`],
    ["f0", `${mh(0, 0, s)} V ${h} H 0 Z`],
    ["f7", `${mv(0, s, 0)} H ${s} V ${h} ${a(h, s, 0)} Z`],
    ["fd", `${mh(0, 0, s)} V ${s} H ${h} ${a(0, h, 0)} Z`],
    ["ff", `${mh(0, 0, s)} V ${s} H 0 Z`],
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
