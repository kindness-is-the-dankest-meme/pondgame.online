import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Item,
  ItemTitle,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item.tsx";

declare const m: HTMLElementTagNameMap["main"];

createRoot(m).render(
  <StrictMode>
    <Item variant="outline" className="relative top-4 left-4 size-fit">
      <ItemContent>
        <ItemTitle>Pond Game</ItemTitle>
        <ItemDescription>
          <Badge variant="secondary">Online</Badge>
        </ItemDescription>
      </ItemContent>
    </Item>
  </StrictMode>
);
