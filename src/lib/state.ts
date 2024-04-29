import { produce } from "immer";

type JsonPrimitive = boolean | null | number | string;
type JsonObject = { [K in string]: JsonValue } & {
  [K in string]?: JsonValue | undefined;
};
type JsonArray = JsonValue[] | readonly JsonValue[];
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

type Action = { type: string; meta: JsonObject; payload: JsonValue };
type Reducer<T> = (state: T, action: Action) => T;

const createState = <T>(
  reducer: ReturnType<typeof produce<Reducer<T>>>,
  initialState: T
) => {
  let state = structuredClone(initialState);

  type Listener = (state: T, prevState: T) => void;
  const listeners: Set<Listener> = new Set();

  const getState = () => state;

  const setState = (partial: (state: T) => T) => {
    const nextState = partial(state);

    if (!Object.is(nextState, state)) {
      const prevState = state;
      state = Object.assign({}, state, nextState);
      listeners.forEach((l) => l(state, prevState));
    }
  };

  const dispatch = (action: Action) => {
    setState(() => reducer(state, action));
    return action;
  };

  const subscribe = (listener: Listener) => listeners.add(listener);

  return {
    getState,
    dispatch,
    subscribe,
  };
};

const reducer = produce((state, action) => {
  switch (action.type) {
    default: {
      state;
    }
  }
});

export const state = createState(reducer, { message: "Hello" });
