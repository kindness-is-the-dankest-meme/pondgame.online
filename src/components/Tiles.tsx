import { useState, type FC } from "react";
import { Svg } from "@react-three/drei";

const tiles = [
  "00",
  "02",
  "08",
  "0f",
  "20",
  "22",
  "3c",
  "77",
  "7f",
  "80",
  "88",
  "c3",
  "dd",
  "df",
  "f0",
  "f7",
  "fd",
  "ff",
];

const Tiles: FC = () => {
  const [tile, setTile] = useState(tiles.length - 1);

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
