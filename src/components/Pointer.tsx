import { Tile } from "@/components/Tile.tsx";
import { ceil, floor, hypot } from "@/lib/maths.ts";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, type ComponentProps, type FC } from "react";
import type { Object3D } from "three";

export const Pointer: FC = () => {
  const [d, setD] = useState<ComponentProps<typeof Tile>["d"]>(0x00);
  const tileRef = useRef<Object3D>(null!);

  useFrame((s) => {
    if (!tileRef.current) {
      return;
    }

    const px = (s.pointer.x * s.viewport.width) / 2,
      py = (s.pointer.y * s.viewport.height) / 2,
      cx = floor(px),
      cy = ceil(py);

    tileRef.current.position.set(cx, cy, 0);
    setD(
      hypot(px - cx, py - cy) < 0.5
        ? 0x80
        : hypot(px - (cx + 1), py - cy) < 0.5
        ? 0x20
        : hypot(px - (cx + 1), py - (cy - 1)) < 0.5
        ? 0x08
        : hypot(px - cx, py - (cy - 1)) < 0.5
        ? 0x02
        : 0xff
    );
  });

  return <Tile d={d} ref={tileRef} />;
};
