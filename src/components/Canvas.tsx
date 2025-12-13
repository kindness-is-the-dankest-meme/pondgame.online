import {
  type RenderProps,
  events as createPointerEvents,
  extend,
} from "@react-three/fiber";
import { type FC, type ReactNode, useMemo } from "react";
import { MeshBasicMaterial, OrthographicCamera, PlaneGeometry } from "three";

type CanvasProps = Omit<RenderProps<HTMLCanvasElement>, "size"> &
  React.HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
  };

export const Canvas: FC<CanvasProps> = ({
  children,
  style,
  gl,
  events = createPointerEvents,
  shadows,
  linear,
  flat,
  legacy,
  orthographic,
  frameloop,
  dpr,
  performance,
  raycaster,
  camera,
  scene,
  onPointerMissed,
  onCreated,
  ...props
}) => {
  useMemo(
    () =>
      extend({
        OrthographicCamera,
        PlaneGeometry,
        MeshBasicMaterial,
      }),
    []
  );

  return null;
};
