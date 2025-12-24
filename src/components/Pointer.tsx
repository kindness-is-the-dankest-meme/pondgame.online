import { Tile } from "@/components/Tile.tsx";
import { useFrame } from "@react-three/fiber";
import { useRef, type FC } from "react";
import type { Object3D } from "three";

export const Pointer: FC = () => {
  const tileRef = useRef<Object3D>(null!);

  useFrame((s) => {
    if (!tileRef.current) {
      return;
    }

    tileRef.current.position.set(
      Math.floor((s.pointer.x * s.viewport.width) / 2),
      Math.floor((s.pointer.y * s.viewport.height) / 2) + 1,
      0
    );
  });

  return <Tile ref={tileRef} d={0xff} />;
};
