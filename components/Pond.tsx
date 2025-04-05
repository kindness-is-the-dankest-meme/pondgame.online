import { useTiles } from "./useTiles.ts";

const { round } = Math;

type PondProps = {
  data: string;
  size: number;
};

export const Pond = ({ data, size }: PondProps) => {
  const [d, isTile] = useTiles(size);

  const rows = data.split("\n").filter((row) => row !== "");
  const rowCount = rows.length;
  const colCount = rows[0]?.split(" ").length ?? 0;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${colCount * size} ${rowCount * size}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      stroke-width={`${size / 4}px`}
    >
      {rows.map((row, i) =>
        row
          .split(" ")
          .map((tile, j) =>
            isTile(tile) && (
              <path
                d={d(tile)}
                transform={`translate(${j * size}, ${i * size})`}
              />
            )
          )
      )}
    </svg>
  );
};
