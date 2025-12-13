import { useFiber, traverseFiber, useContextBridge } from "its-fine";
import { useMemo, StrictMode, Fragment } from "react";

/**
 * @see https://github.com/pmndrs/react-three-fiber/blob/2541e81fb6ddc22d0869b9eb5cdbedcbbc62324c/packages/fiber/src/core/utils.tsx#L72-L90
 */
export const useBridge = () => {
  const fiber = useFiber();
  const ContextBridge = useContextBridge();

  return useMemo(
    () =>
      ({ children }) => {
        const strict = !!traverseFiber(
          fiber,
          true,
          (node) => node.type === StrictMode
        );
        const Root = strict ? StrictMode : Fragment;

        return (
          <Root>
            <ContextBridge>{children}</ContextBridge>
          </Root>
        );
      },
    [fiber, ContextBridge]
  );
};
