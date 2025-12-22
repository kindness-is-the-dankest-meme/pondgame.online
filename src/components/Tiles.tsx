import { useState, type FC } from "react";
import { Svg } from "@react-three/drei";

const tiles = [
  "0x00",
  "0x01",
  "0x02",
  "0x03",
  "0x04",
  "0x05",
  "0x06",
  "0x07",
  "0x08",
  "0x09",
  "0x0a",
  "0x0b",
  "0x0c",
  "0x0d",
  "0x0e",
  "0x0f",
  "0x15",
  "0x1a",
];

const Tiles: FC = () => {
  const [tile, setTile] = useState(15);

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
