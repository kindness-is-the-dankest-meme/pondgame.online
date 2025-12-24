import { PgCanvas } from "@/components/PgCanvas.tsx";
import { Pointer } from "@/components/Pointer.tsx";
import { Tile } from "@/components/Tile.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { Grid, OrthographicCamera } from "@react-three/drei";
import type { FC } from "react";

export const App: FC = () => (
  <>
    <PgCanvas>
      <Tile d={0x00} position={[-3, 2, 0]} />
      <Tile d={0x02} position={[-2, 2, 0]} />
      <Tile d={0x08} position={[-1, 2, 0]} />
      <Tile d={0x0f} position={[0, 2, 0]} />
      <Tile d={0x20} position={[1, 2, 0]} />
      <Tile d={0x22} position={[2, 2, 0]} />
      <Tile d={0x3c} position={[-3, 1, 0]} />
      <Tile d={0x77} position={[-2, 1, 0]} />
      <Tile d={0x7f} position={[-1, 1, 0]} />
      <Tile d={0x80} position={[0, 1, 0]} />
      <Tile d={0x88} position={[1, 1, 0]} />
      <Tile d={0xc3} position={[2, 1, 0]} />
      <Tile d={0xdd} position={[-3, 0, 0]} />
      <Tile d={0xdf} position={[-2, 0, 0]} />
      <Tile d={0xf0} position={[-1, 0, 0]} />
      <Tile d={0xf7} position={[0, 0, 0]} />
      <Tile d={0xfd} position={[1, 0, 0]} />
      <Tile d={0xff} position={[2, 0, 0]} />
      <Pointer />
      <Grid
        infiniteGrid
        position={[0, 0, 0.01]}
        rotation={[Math.PI / 2, 0, 0]}
      />
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
  </>
);
