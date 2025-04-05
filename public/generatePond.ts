const { floor, random } = Math;

/**
 * ∙ ╭ ─ ─ ╮ ∙
 * ╭ ╯ ∙ ∙ ╰ ╮
 * │ ∙ ╭ ╮ ∙ │
 * │ ∙ ╰ ╯ ∙ │
 * ╰ ╮ ∙ ∙ ╭ ╯
 * ∙ ╰ ─ ─ ╯ ∙
 */
const allowedNeighbors = {
  "╭": {
    up: "∙─╯╰",
    right: "─╮╯",
    down: "│╯╰",
    left: "∙│╯╮",
  },
  "╮": {
    up: "∙─╯╰",
    right: "∙│╭╰",
    down: "│╯╰",
    left: "╭╰─",
  },
  "╯": {
    up: "│╮╭",
    right: "∙│╭╰",
    down: "∙─╮╭",
    left: "╭╰─",
  },
  "╰": {
    up: "│╮╭",
    right: "─╮╯",
    down: "∙─╮╭",
    left: "∙│╯╮",
  },
  "│": {
    up: "│╮╭",
    right: "∙│╭╰",
    down: "│╯╰",
    left: "∙│╯╮",
  },
  "─": {
    up: "∙─╯╰",
    right: "─╮╯",
    down: "∙─╮╭",
    left: "╭╰─",
  },
  "∙": {
    up: "∙─╯╰",
    right: "∙│╭╰",
    down: "∙─╮╭",
    left: "∙│╯╮",
  },
  "": {
    up: "",
    right: "",
    down: "",
    left: "",
  },
} as const;

const validCels = Object.keys(allowedNeighbors);
type Cel = keyof typeof allowedNeighbors;
const isCel = (x: string): x is Cel => validCels.includes(x);

const chance = (n: number) => random() < n;

type GridMapFn<T extends string = string> = (i: number, j: number) => T;

const grid = (
  width: number,
  height: number,
  mapFn: GridMapFn,
): string[][] =>
  Array.from(
    { length: height },
    (_, i) => Array.from({ length: width }, (_, j) => mapFn(i, j)),
  );

const outline =
  (width: number, height: number): GridMapFn<"∙" | ""> => (i, j) =>
    i === 0 || i === height - 1 || j === 0 || j === width - 1 ? "∙" : "";

export const generatePond = (width: number, height: number): string =>
  grid(width, height, outline(width, height))
    .reduce<string[][]>(
      (acc, row, i, rows) => (
        acc.push(
          row.reduce<string[]>((cels, cel, j) => {
            if (i === 0 || i === height - 1 || j === 0 || j === width - 1) {
              cels[j] = cel;
              return cels;
            }

            const neighborUp = acc[i - 1]?.[j];
            const neighborRight = row[j + 1];
            const neighborDown = rows[i + 1]?.[j];
            const neighborLeft = cels[j - 1];

            if (
              !(
                isCel(neighborUp) &&
                isCel(neighborRight) &&
                isCel(neighborDown) &&
                isCel(neighborLeft)
              )
            ) {
              throw new Error("Invalid neighbor");
            }

            /**
             * this might be kind of confusing to future me, but I'm using
             * "downward neighbor" to get the "upward constraint" and so on,
             * because this is working top to bottom and left to right it's
             * mostly downward and rightward constraints
             */
            const allowedUp = allowedNeighbors[neighborDown]?.up ?? "";
            const allowedRight = allowedNeighbors[neighborLeft]?.right ?? "";
            const allowedDown = allowedNeighbors[neighborUp]?.down ?? "";
            const allowedLeft = allowedNeighbors[neighborRight]?.left ?? "";

            const allowed = (
              allowedUp +
              allowedRight +
              allowedDown +
              allowedLeft
            )
              .split("")
              .filter(
                (c) =>
                  // only check for includes if the constraint is a non-empty
                  // string
                  (allowedUp === "" || allowedUp.includes(c)) &&
                  (allowedRight === "" || allowedRight.includes(c)) &&
                  (allowedDown === "" || allowedDown.includes(c)) &&
                  (allowedLeft === "" || allowedLeft.includes(c)),
              )
              .join("");

            // prefer empty spaces as neighbors to straight lines
            if (
              (neighborLeft === "│" || neighborUp === "─") &&
              allowed.includes("∙")
            ) {
              if (chance(7 / 10)) {
                cels[j] = "∙";
                return cels;
              }
            }

            // prefer straight lines as neighbors to corners
            if (
              (neighborUp === "╭" ||
                neighborUp === "╮") &&
              allowed.includes("|")
            ) {
              if (chance(9 / 10)) {
                cels[j] = "|";
                return cels;
              }
            }

            // prefer straight lines as neighbors to corners
            if (
              (neighborLeft === "╭" || neighborLeft === "╰") &&
              allowed.includes("-")
            ) {
              if (chance(9 / 10)) {
                cels[j] = "-";
                return cels;
              }
            }

            // prefer empty spaces as neighbors to empty spaces
            if (
              (neighborRight === "∙" ||
                neighborLeft === "∙" ||
                neighborUp === "∙" ||
                neighborDown === "∙") &&
              allowed.includes("∙")
            ) {
              if (chance(9 / 10)) {
                cels[j] = "∙";
                return cels;
              }
            }

            // prefer continuing vertical lines
            if (neighborUp === "│" && allowed.includes("│")) {
              if (chance(5 / 10)) {
                cels[j] = "│";
                return cels;
              }
            }

            // prefer continuing horizontal lines
            if (neighborLeft === "─" && allowed.includes("─")) {
              if (chance(5 / 10)) {
                cels[j] = "─";
                return cels;
              }
            }

            cels[j] = allowed.charAt(floor(random() * allowed.length));
            return cels;
          }, []),
        ), acc
      ),
      [],
    )
    .reduce((acc, row) => `${acc}${row.join(" ")}\n`, "");
