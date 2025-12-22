import { renderToStaticMarkup } from "react-dom/server";

type T =
  | "0x00" // ∙ a
  | "0x01" // ▝ b
  | "0x02" // ▘ c
  | "0x03" // ▀ d
  | "0x04" // ▖ e
  | "0x05" // ▞ f
  | "0x06" // ▌ g
  | "0x07" // ▛ h
  | "0x08" // ▗ i
  | "0x09" // ▐ j
  | "0x0a" // ▚ k
  | "0x0b" // ▜ l
  | "0x0c" // ▄ m
  | "0x0d" // ▟ n
  | "0x0e" // ▙ o
  | "0x0f" // █ p
  | "0x15" // ╱ q // u // v
  | "0x1a"; // ╲ r // z // A

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
    ["0x00", ""],
    ["0x01", `${ne} Z`],
    ["0x02", `${nw} Z`],
    ["0x03", `${mh(0, 0, s)} V ${h} H 0 Z`],
    ["0x04", `${sw} Z`],
    ["0x05", `${ne} Z ${sw} Z`],
    ["0x06", `${mh(0, 0, h)} V ${s} H 0 Z`],
    ["0x07", `${mv(0, s, 0)} H ${s} V ${h} ${a(h, s, 0)} Z`],
    ["0x08", `${se} Z`],
    ["0x09", `${mh(h, 0, s)} V ${s} H ${h} Z`],
    ["0x0a", `${nw} Z ${se} Z`],
    ["0x0b", `${mh(0, 0, s)} V ${s} H ${h} ${a(0, h, 0)} Z`],
    ["0x0c", `${mv(s, h, s)} H 0 V ${h} Z`],
    ["0x0d", `${mv(s, 0, s)} H 0 V ${h} ${a(h, 0, 0)} Z`],
    ["0x0e", `${mh(s, s, 0)} V 0 H ${h} ${a(s, h, 0)} Z`],
    ["0x0f", `${mh(0, 0, s)} V ${s} H 0 Z`],
    ["0x15", `${mv(s, 0, h)} ${a(h, s, 0)} H 0 V ${h} ${a(h, 0, 0)} Z`],
    ["0x1a", `${mh(0, 0, h)} ${a(s, h, 0)} V ${s} H ${h} ${a(0, h, 0)} Z`],
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
