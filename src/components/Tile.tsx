import type { FC } from "react";
import { Svg, type SvgProps } from "@react-three/drei";

const s = 32;

const ds = (() => {
  const h = s / 2,
    a = (x: number, y: number, f: 0 | 1 = 1) =>
      `A ${h} ${h} 0 0 ${f} ${x} ${y}`,
    mh = (x: number, y: number, h: number) => `M ${x} ${y} H ${h}`,
    mv = (x: number, y: number, v: number) => `M ${x} ${y} V ${v}`,
    nw = `${mh(0, 0, h)} ${a(0, h)}`,
    ne = `${mv(s, 0, h)} ${a(h, 0)}`,
    se = `${mh(s, s, h)} ${a(s, h)}`,
    sw = `${mv(0, s, h)} ${a(h, s)}`;

  return {
    0x00: "",
    0x02: `${sw} Z`,
    0x08: `${se} Z`,
    0x0f: `${mv(s, h, s)} H 0 V ${h} Z`,
    0x20: `${ne} Z`,
    0x22: `${ne} Z ${sw} Z`,
    0x3c: `${mh(h, 0, s)} V ${s} H ${h} Z`,
    0x77: `${mv(s, 0, h)} ${a(h, s, 0)} H 0 V ${h} ${a(h, 0, 0)} Z`,
    0x7f: `${mv(s, 0, s)} H 0 V ${h} ${a(h, 0, 0)} Z`,
    0x80: `${nw} Z`,
    0x88: `${nw} Z ${se} Z`,
    0xc3: `${mh(0, 0, h)} V ${s} H 0 Z`,
    0xdd: `${mh(0, 0, h)} ${a(s, h, 0)} V ${s} H ${h} ${a(0, h, 0)} Z`,
    0xdf: `${mh(s, s, 0)} V 0 H ${h} ${a(s, h, 0)} Z`,
    0xf0: `${mh(0, 0, s)} V ${h} H 0 Z`,
    0xf7: `${mv(0, s, 0)} H ${s} V ${h} ${a(h, s, 0)} Z`,
    0xfd: `${mh(0, 0, s)} V ${s} H ${h} ${a(0, h, 0)} Z`,
    0xff: `${mh(0, 0, s)} V ${s} H 0 Z`,
  } as const;
})();

const uri = (d: (typeof ds)[keyof typeof ds]) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg viewBox="0 0 ${s} ${s}"><g><rect width="${s}" height="${s}" fill="black" opacity="0" />${
      d ? `<path d="${d}" fill="white" />` : ""
    }</g></svg>`
  )}`;

type TileProps = Omit<SvgProps, "src" | "scale"> & {
  d: keyof typeof ds;
};

export const Tile: FC<TileProps> = ({ d, ...props }) => (
  <Svg src={uri(ds[d])} scale={1 / s} {...props} />
);
