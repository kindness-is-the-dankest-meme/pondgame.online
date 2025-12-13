import {
  useLayoutEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

export type PgSetBlock = false | Promise<null> | null;
export type PgUnblockProps = {
  set: Dispatch<SetStateAction<PgSetBlock>>;
  children: ReactNode;
};

export function PgBlock({ set }: Omit<PgUnblockProps, "children">) {
  useLayoutEffect(() => {
    set(new Promise(() => null));
    return () => set(false);
  }, [set]);
  return null;
}
