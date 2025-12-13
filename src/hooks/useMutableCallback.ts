import { type RefObject, useRef, useLayoutEffect } from "react";

/**
 * @see https://github.com/pmndrs/react-three-fiber/blob/2541e81fb6ddc22d0869b9eb5cdbedcbbc62324c/packages/fiber/src/core/utils.tsx#L61-L65
 */
export const useMutableCallback = <T>(fn: T): RefObject<T> => {
  const ref = useRef<T>(fn);
  useLayoutEffect(() => void (ref.current = fn), [fn]);
  return ref;
};
