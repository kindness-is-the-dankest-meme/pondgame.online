interface EventMap {
  [eventType: string]: Event;
}

type EventFactory<T extends EventMap> = {
  [K in keyof T]: (...args: any[]) => T[K];
};

type WithOnCallbacks<T extends EventMap> = {
  [K in keyof T as `on${string &
    K}`]: EventListenerOrEventListenerObject | null;
};

interface IEventTarget<T extends EventMap, U> extends EventTarget {
  addEventListener<K extends keyof T>(
    type: K,
    listener: (this: U, event: T[K]) => void,
    options?: AddEventListenerOptions | boolean
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean
  ): void;

  removeEventListener<K extends keyof T>(
    type: K,
    listener: (this: U, event: T[K]) => void,
    options?: EventListenerOptions | boolean
  ): void;
  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void;
}

export const createEventTarget = <
  T extends EventMap,
  U extends {
    new (...args: any[]): any;
  }
>(
  Constructor: U,
  eventFactory: EventFactory<T>
): U & IEventTarget<T, U> & WithOnCallbacks<T> => {
  const wrapped = Symbol();

  const TEventTarget = EventTarget as {
    prototype: IEventTarget<T, U>;
    new (): IEventTarget<T, U>;
  };

  console.log(Object.getOwnPropertyDescriptors(Constructor.prototype));
  const { getters, methods } = Object.entries(
    Object.getOwnPropertyDescriptors(Constructor.prototype)
  ).reduce<{
    getters: string[];
    methods: string[];
  }>(
    (descriptors, [name, descriptor]) => {
      if (name === "constructor") {
        return descriptors;
      }

      if ("get" in descriptor) {
        descriptors.getters.push(name);
      }

      if ("value" in descriptor && typeof descriptor.value === "function") {
        descriptors.methods.push(name);
      }

      return descriptors;
    },
    {
      getters: [],
      methods: [],
    }
  );

  class UEventTarget extends TEventTarget {
    [wrapped]: typeof Constructor;

    constructor(...args: ConstructorParameters<U>) {
      super();

      const base = (this[wrapped] = new Constructor(...args));

      Object.entries(eventFactory).forEach(([eventType, factory]) => {
        base[`on${eventType}`] = (...args: any[]) =>
          this.dispatchEvent(factory(...args));
      });

      Object.defineProperties(
        this,
        getters.reduce<{ [name: string]: PropertyDescriptor }>(
          (descriptors, name) => {
            descriptors[name] = {
              get: () => base[name],
            };

            return descriptors;
          },
          {}
        )
      );
    }

    dispatchEvent<K extends keyof T>(event: T[K]) {
      // @ts-expect-error - not sure how to type this
      if (typeof this[`on${event.type}`] === "function") {
        // @ts-expect-error - not sure how to type this
        this[`on${event.type}`]?.(event);
      }

      return super.dispatchEvent(event);
    }
  }

  Object.defineProperties(
    UEventTarget.prototype,
    methods.reduce<{ [name: string]: PropertyDescriptor }>(
      (descriptors, name) => {
        descriptors[name] = {
          value: function (...args: any[]) {
            // @ts-expect-error - not sure how to type this
            return this[wrapped][name](...args);
          },
        };

        return descriptors;
      },
      {}
    )
  );

  return UEventTarget as U & IEventTarget<T, U> & WithOnCallbacks<T>;
};
