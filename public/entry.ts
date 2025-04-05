import { generateDraw } from "./generateDraw.ts";
import { generatePond } from "./generatePond.ts";

declare const pond: SVGElementTagNameMap["svg"];
declare const size: HTMLElementTagNameMap["input"];
declare const full: HTMLElementTagNameMap["button"];

const { floor, random } = Math,
  rrng = (min: number, max: number) => floor(min + random() * (max - min)),
  state = {
    get size() {
      return size.valueAsNumber;
    },
    get smin() {
      return Number(size.min);
    },
    get smax() {
      return Number(size.max);
    },
    get cols() {
      return floor(globalThis.innerWidth / this.size);
    },
    get rows() {
      return floor(globalThis.innerHeight / this.size);
    },
  },
  render = () => {
    const { size, cols, rows } = state,
      [draw, isDrawable] = generateDraw(size),
      data = generatePond(cols, rows),
      rowsData = data.split("\n").filter((row) => row !== ""),
      rowCount = rowsData.length,
      colCount = rowsData[0].split(" ").length;

    pond.setAttribute("viewBox", `0 0 ${colCount * size} ${rowCount * size}`);
    pond.setAttribute("stroke-width", `${size * 0.3}px`);

    pond.innerHTML = rowsData.map((row, i) =>
      row
        .split(" ")
        .reduce<string[]>((acc, cel, j) => {
          if (isDrawable(cel)) {
            acc.push(
              `<path d="${draw(cel)}" transform="${`translate(${j * size}, ${
                i * size
              })`}" />`,
            );
          }

          return acc;
        }, []).join("")
    ).join("");
  };

globalThis.addEventListener("resize", render, { passive: true });
size.addEventListener("change", render, { passive: true });
globalThis.addEventListener("click", render);

setInterval(
  () => {
    const { smin, smax } = state;
    size.value = String(rrng(smin, smax));
    size.dispatchEvent(new Event("change"));
  },
  10000,
);

globalThis.dispatchEvent(new Event("resize"));

full.addEventListener(
  "click",
  () => document.documentElement.requestFullscreen(),
);
