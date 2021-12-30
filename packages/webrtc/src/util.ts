interface AnyConstructor {
  prototype: any;
  new (...args: any[]): any;
}

export const propsOf = <T extends AnyConstructor>(
  Constructor: T,
  omitProps: string[] = ["constructor"]
): string[] =>
  Object.getOwnPropertyNames(Constructor.prototype)
    .filter((prop) => !omitProps.includes(prop))
    .sort();
