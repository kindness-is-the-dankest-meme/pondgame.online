import { Component } from "react";

/**
 * @see https://github.com/pmndrs/react-three-fiber/blob/2541e81fb6ddc22d0869b9eb5cdbedcbbc62324c/packages/fiber/src/core/utils.tsx#L104-L117
 */
export const PgErrorBoundary = /* @__PURE__ */ (() =>
  class ErrorBoundary extends Component<
    { set: React.Dispatch<Error | undefined>; children: React.ReactNode },
    { error: boolean }
  > {
    state = { error: false };
    static getDerivedStateFromError = () => ({ error: true });
    componentDidCatch(err: Error) {
      this.props.set(err);
    }
    render() {
      return this.state.error ? null : this.props.children;
    }
  })();
