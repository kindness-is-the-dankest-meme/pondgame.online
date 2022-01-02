import { NativeRTCDataChannel, NativeRTCPeerConnection } from "./binding.js";
import { RTCDataChannelEvent } from "./RTCDataChannelEvent.js";
import { RTCIceCandidate } from "./RTCIceCandidate.js";
import { RTCPeerConnectionIceErrorEvent } from "./RTCPeerConnectionIceErrorEvent.js";
import { RTCPeerConnectionIceEvent } from "./RTCPeerConnectionIceEvent.js";
import { RTCTrackEvent } from "./RTCTrackEvent.js";

interface IEventable extends EventTarget {
  [key: `on${string}`]: EventListenerOrEventListenerObject | null;
}

const isIEventable = (
  eventable: any,
  eventType: string
): eventable is IEventable => `on${eventType}` in eventable;

const createEventable = () => {
  const kEventTarget = Symbol("kEventTarget");
  const ensureEventTarget = (eventable: any) => {
    eventable[kEventTarget] || (eventable[kEventTarget] = new EventTarget());
  };

  return class Eventable implements EventTarget {
    [kEventTarget]: EventTarget;

    constructor() {
      throw new Error(`\
Eventable is meant to be used for it's prototype only, like:

\`\`\`
class Foo {}
const Eventable = createEventable();
Object.setPrototypeOf(Foo.prototype, Eventable.prototype);

const foo = new Foo() as Eventable;
foo.onbar = () => console.log("baz");
foo.addEventListener("bar", () => console.log("qux"));
foo.dispatchEvent(new Event("bar"));
\`\`\`
`);
    }

    addEventListener(
      type: string,
      callback: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions
    ): void {
      ensureEventTarget(this);
      this[kEventTarget].addEventListener(type, callback, options);
    }

    removeEventListener(
      type: string,
      callback: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions
    ): void {
      ensureEventTarget(this);
      this[kEventTarget].removeEventListener(type, callback, options);
    }

    dispatchEvent(event: Event): boolean {
      ensureEventTarget(this);

      if (isIEventable(this, event.type)) {
        const listener = this[`on${event.type}`];

        if (
          typeof listener === "object" &&
          typeof listener?.handleEvent === "function"
        ) {
          listener.handleEvent(event);
        }

        if (typeof listener === "function") {
          listener(event);
        }
      }

      return this[kEventTarget].dispatchEvent(event);
    }
  };
};

interface AnyConstructor {
  prototype: any;
  new (...args: any[]): any;
  [key: string]: any;
}

interface EventMap {
  [eventType: string]: Event;
}

type EventFactoryMap<T extends EventMap> = {
  [K in keyof T]: (...args: any[]) => T[K];
};

const wrapWithEventable = <T extends AnyConstructor, U extends EventMap>(
  Wrappee: T,
  eventFactoryMap: EventFactoryMap<U>
): T & IEventable => {
  const Eventable = createEventable();

  const { constructor: _Wrappee, ...wrappeeDescriptorMap } =
    Object.getOwnPropertyDescriptors(Wrappee.prototype);

  const accessorDescriptors = Object.entries(wrappeeDescriptorMap).filter(
    ([, descriptor]) => "get" in descriptor && "set" in descriptor
  );

  const methodDescriptors = Object.entries(wrappeeDescriptorMap).filter(
    ([, descriptor]) =>
      "value" in descriptor &&
      "writable" in descriptor &&
      typeof descriptor.value === "function"
  );

  const kWrapped = Symbol("kWrapped");
  class Wrapped {
    [kWrapped]: T;

    constructor(...args: ConstructorParameters<T>) {
      const wrapped = (this[kWrapped] = new Wrappee(...args));

      Object.entries(eventFactoryMap).forEach(([eventType, eventFactory]) => {
        wrapped[`on${eventType}`] = (...args: any[]) =>
          // @ts-expect-error
          this.dispatchEvent(eventFactory(...args));
      });

      Object.defineProperties(
        this,
        accessorDescriptors.reduce<PropertyDescriptorMap>(
          (descriptorMap, [name, { configurable, enumerable, get, set }]) => {
            descriptorMap[name] = {
              configurable,
              enumerable,
              get: get ? () => wrapped[name] : undefined,
              set: set
                ? (value: typeof Wrappee[typeof name]) =>
                    (wrapped[name] = value)
                : undefined,
            };

            return descriptorMap;
          },
          {}
        )
      );
    }
  }

  Object.setPrototypeOf(Wrapped.prototype, Eventable.prototype);
  Object.defineProperty(Wrapped, "name", { value: Wrappee.name });
  Object.defineProperties(
    Wrapped.prototype,
    methodDescriptors.reduce<PropertyDescriptorMap>(
      (descriptorMap, [name, { configurable, enumerable, writable }]) => {
        descriptorMap[name] = {
          configurable: true,
          enumerable,
          value: function (this: Wrapped, ...args: any[]) {
            return this[kWrapped][name](...args);
          },
          writable,
        };

        return descriptorMap;
      },
      {}
    )
  );

  return Wrapped as T & IEventable;
};

const RTCPeerConnection = wrapWithEventable<
  typeof globalThis.RTCPeerConnection,
  globalThis.RTCPeerConnectionEventMap & {
    [eventType: string]: Event;
  }
>(NativeRTCPeerConnection, {
  connectionstatechange: () => new Event("connectionstatechange"),
  datachannel: (channel: RTCDataChannel) =>
    new RTCDataChannelEvent("datachannel", { channel }),
  icecandidate: (partialCandidate: Partial<RTCIceCandidate>) =>
    new RTCPeerConnectionIceEvent("icecandidate", {
      candidate: new RTCIceCandidate(partialCandidate),
    }),
  icecandidateerror: (
    eventInit: Omit<RTCPeerConnectionIceErrorEventInit, "address" | "port"> & {
      hostCandidate: string;
    }
  ) => {
    const { hostCandidate, errorCode, errorText, url } = eventInit;
    const [address, port] = hostCandidate.split(":");

    return new RTCPeerConnectionIceErrorEvent("icecandidateerror", {
      address,
      errorCode,
      errorText,
      port: port ? parseInt(port, 10) : null,
      url,
    });
  },
  iceconnectionstatechange: () => new Event("iceconnectionstatechange"),
  icegatheringstatechange: () => new Event("icegatheringstatechange"),
  negotiationneeded: () => new Event("negotiationneeded"),
  signalingstatechange: () => new Event("signalingstatechange"),
  track: (
    receiver: RTCRtpReceiver,
    streams: MediaStream[],
    transceiver: RTCRtpTransceiver
  ) => {
    const { track } = receiver;

    return new RTCTrackEvent("track", {
      receiver,
      streams,
      track,
      transceiver,
    });
  },
});

const wrapInstance = <T extends any, U extends EventMap>(
  instance: T,
  eventFactoryMap: EventFactoryMap<U>
): T & IEventable => {
  const Eventable = createEventable();
  class Wrapped {
    constructor() {
      Object.entries(eventFactoryMap).forEach(([eventType, eventFactory]) => {
        // @ts-expect-error
        instance[`on${eventType}`] = (...args: any[]) =>
          // @ts-expect-error
          this.dispatchEvent(eventFactory(...args));
      });
    }
  }

  Object.setPrototypeOf(Wrapped.prototype, Eventable.prototype);
  Object.defineProperty(Wrapped, "name", {
    value: Object.getPrototypeOf(instance).constructor.name,
  });

  return new Wrapped() as T & IEventable;
};

const createDataChannelDescriptor = Object.getOwnPropertyDescriptor(
  RTCPeerConnection.prototype,
  "createDataChannel"
);
Object.defineProperty(RTCPeerConnection.prototype, "createDataChannel", {
  value: function createDataChannel(
    ...args: Parameters<RTCPeerConnection["createDataChannel"]>
  ) {
    return wrapInstance(createDataChannelDescriptor?.value.apply(this, args), {
      bufferedamountlow: () => new Event("bufferedamountlow"),
      close: () => new Event("close"),
      error: () => new Event("error"),
      message: (eventInit: MessageEventInit) =>
        new MessageEvent("message", eventInit),
      open: () => new Event("open"),
    });
  },
});

const rtcp = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:global.stun.twilio.com:3478",
      ],
    },
  ],
});
const channel = rtcp.createDataChannel("test");
channel.onopen = () => console.log("channel.onopen");
channel.addEventListener("open", () => console.log("channel.addEventListener"));
channel.dispatchEvent(new Event("open"));

rtcp.onnegotiationneeded = () => console.log("rtcp.onnegotiationneeded");
rtcp.addEventListener("negotiationneeded", () =>
  console.log("rtcp.addEventListener")
);
rtcp.dispatchEvent(new Event("negotiationneeded"));

// import { NativeRTCDataChannel } from "./binding.js";
// import { createEventTarget } from "./createEventTarget.js";
// export { RTCPeerConnection } from "./RTCPeerConnection.js";

// export const RTCDataChannel = createEventTarget<
//   typeof globalThis.RTCDataChannel,
//   globalThis.RTCDataChannelEventMap & {
//     [eventType: string]: Event;
//   }
// >(NativeRTCDataChannel, {
//   bufferedamountlow: () => new Event("bufferedamountlow"),
//   close: () => new Event("close"),
//   error: () => new Event("error"),
//   message: (eventInit: MessageEventInit) =>
//     new MessageEvent("message", eventInit),
//   open: () => new Event("open"),
// });
