import { PgBlock, type PgSetBlock } from "@/components/PgBlock.tsx";
import { PgErrorBoundary } from "@/components/PgErrorBoundary.tsx";
import { useBridge } from "@/hooks/useBridge.tsx";
import { useMutableCallback } from "@/hooks/useMutableCallback.ts";
import {
  createRoot,
  events,
  extend,
  unmountComponentAtNode,
  type ReconcilerRoot,
  type RenderProps,
} from "@react-three/fiber";
import { FiberProvider } from "its-fine";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import useMeasure from "react-use-measure";

const { Group, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry } =
  await import("three");

type PgCanvasProps = Omit<RenderProps<HTMLCanvasElement>, "size" | "events"> &
  React.HTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
  };

extend({
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
});

const PgCanvasImpl: FC<PgCanvasProps> = ({
  children,
  gl,
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
  const Bridge = useBridge();

  const [containerRef, containerRect] = useMeasure({
    scroll: true,
    debounce: { scroll: 50, resize: 0 },
  });
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const divRef = useRef<HTMLDivElement>(null!);

  const handlePointerMissed = useMutableCallback(onPointerMissed);
  const [block, setBlock] = useState<PgSetBlock>(false);
  const [error, setError] = useState<unknown>(false);

  // Suspend this component if block is a promise (2nd run)
  if (block) throw block;
  // Throw exception outwards if anything within canvas throws
  if (error) throw error;

  const root = useRef<ReconcilerRoot<HTMLCanvasElement>>(null!);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!(canvas && containerRect.width > 0 && containerRect.height > 0)) {
      return;
    }

    if (!root.current) root.current = createRoot<HTMLCanvasElement>(canvas);

    (async function run() {
      await root.current.configure({
        gl,
        scene,
        events,
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
        size: containerRect,
        onPointerMissed: (...args) => handlePointerMissed.current?.(...args),
        onCreated: (state) => {
          state.events.connect?.(divRef.current);
          onCreated?.(state);
        },
      });
      root.current.render(
        <Bridge>
          <PgErrorBoundary set={setError}>
            <Suspense fallback={<PgBlock set={setBlock} />}>
              {children}
            </Suspense>
          </PgErrorBoundary>
        </Bridge>
      );
    })();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) return () => unmountComponentAtNode(canvas);
  }, []);

  return (
    <div
      ref={divRef}
      {...props}
      className="w-full h-full relative overflow-hidden"
    >
      <div ref={containerRef} className="w-full h-full">
        <canvas ref={canvasRef} className="block"></canvas>
      </div>
    </div>
  );
};

export const PgCanvas: FC<PgCanvasProps> = (props) => (
  <FiberProvider>
    <PgCanvasImpl {...props} />
  </FiberProvider>
);
