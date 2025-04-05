import { useEffect, useState } from "preact/hooks";
import { generatePond } from "../lib/generatePond.ts";
import { Pond } from "../components/Pond.tsx";

const { floor, random } = Math;
const range = (a: number, b: number) => floor(a + (random() * (b - a)));

globalThis.addEventListener(
  "contextmenu",
  (event: Event) => event.preventDefault(),
);

export const Game = () => {
  const [size, setSize] = useState<number>(30);
  const [[cols, rows], setDims] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const resetDims = () => {
      const { innerWidth: width, innerHeight: height } = globalThis;
      setDims([floor(width / size), floor(height / size)]);
    };

    globalThis.addEventListener("click", resetDims);
    globalThis.addEventListener("resize", resetDims, { passive: true });

    globalThis.dispatchEvent(new Event("resize"));
    const intervalId = setInterval(() => setSize(range(20, 100)), 10_000);

    return () => {
      globalThis.removeEventListener("click", resetDims);
      globalThis.removeEventListener("resize", resetDims);
      clearInterval(intervalId);
    };
  }, [size]);

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
