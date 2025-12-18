import { PgCanvas } from "@/components/PgCanvas.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { OrthographicCamera, Svg } from "@react-three/drei";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

declare const m: HTMLElementTagNameMap["main"];

createRoot(m).render(
  <StrictMode>
    <PgCanvas>
      <Svg src="./╱.svg" scale={1 / 32} position={[-0.5, 0.5, 0]} />
      <OrthographicCamera
        makeDefault
        position={[0, 0, 1_000]}
        zoom={50}
        near={0.1}
        far={1_000}
      />
    </PgCanvas>
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
