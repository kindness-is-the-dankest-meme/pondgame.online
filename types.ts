export type F<T> = T extends new (...args: infer A) => infer R
  ? (...args: A) => R
  : never;
