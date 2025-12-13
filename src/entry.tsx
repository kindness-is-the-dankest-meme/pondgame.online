import { Badge } from "@/components/ui/badge.tsx";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item.tsx";

const [{ OrthographicCamera }, { Canvas }, { StrictMode }, { createRoot }] =
  await Promise.all([
    import("@react-three/drei/core/OrthographicCamera"),
    import("@/components/Canvas.tsx"),
    import("react"),
    import("react-dom/client"),
  ]);

declare const m: HTMLElementTagNameMap["main"];

createRoot(m).render(
  <StrictMode>
    <Canvas>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial />
      </mesh>
      <OrthographicCamera
        makeDefault
        position={[0, 0, 1_000]}
        zoom={50}
        near={0.1}
        far={1_000}
      />
    </Canvas>
    <Item variant="outline" className="absolute top-4 left-4 size-fit">
      <ItemContent>
        <ItemTitle>Pond Game</ItemTitle>
        <ItemDescription>
          <Badge variant="secondary">Online</Badge>
        </ItemDescription>
      </ItemContent>
    </Item>
  </StrictMode>
);
