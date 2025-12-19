import { useState, type FC } from "react";
import { Svg } from "@react-three/drei";

const tiles = [
  "∙",
  "▝",
  "▘",
  "▀",
  "▖",
  "▞",
  "▌",
  "▛",
  "▗",
  "▐",
  "▚",
  "▜",
  "▄",
  "▟",
  "▙",
  "█",
  "╱",
  "╲",
];

const Tiles: FC = () => {
  const [tile, setTile] = useState(0);

  return (
    <Svg
      src={`./${tiles[tile]}.svg`}
      onClick={() => setTile((tile + 1) % tiles.length)}
      scale={1 / 32}
      position={[-0.5, 0.5, 0]}
    />
  );
};

export default Tiles;
