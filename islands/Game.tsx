import { useEffect, useState } from "preact/hooks";
import { generatePond } from "../lib/generatePond.ts";
import { Pond } from "../components/Pond.tsx";

const { floor, random } = Math;
const range = (a: number, b: number) => floor(a + (random() * (b - a)));

export const Game = () => {
  const [size, setSize] = useState<number>(30);
  const [[cols, rows], setDims] = useState<[number, number]>([
    floor(/* 1_920 */ 0 / size), // 32
    floor(/* 1_080 */ 0 / size), // 18
  ]);

  // useEffect(() => setSize(range(20, 100)), []);

  useEffect(() => {
    const resetDims = () => {
      const { innerWidth: width, innerHeight: height } = globalThis;
      setDims([floor(width / size), floor(height / size)]);
    };

    globalThis.addEventListener("click", resetDims);
    globalThis.addEventListener("resize", resetDims, { passive: true });
    globalThis.dispatchEvent(new Event("resize"));

    return () => {
      globalThis.removeEventListener("click", resetDims);
      globalThis.removeEventListener("resize", resetDims);
    };
  }, [size]);

  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();
    globalThis.addEventListener("contextmenu", prevent);
    return () => globalThis.removeEventListener("contextmenu", prevent);
  }, []);

  return (
    <>
      <Pond data={generatePond(cols, rows)} size={size} />
      <div>
        <input
          type="range"
          min="20"
          max="100"
          step="1"
          value={size}
          onChange={({ currentTarget: { valueAsNumber } }) =>
            setSize(valueAsNumber)}
        />
        <button
          type="button"
          onClick={() => {
            document.documentElement.requestFullscreen();
          }}
        >
          ⛶
        </button>
      </div>
    </>
  );
};
