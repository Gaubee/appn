import {accessor, obj_props} from '@gaubee/util';
import type {ReactiveController, ReactiveElement} from 'lit';
import {Signal} from 'signal-polyfill';
import {effect} from 'signal-utils/subtle/microtask-effect';
export {Signal};
export type AnySignal<T = any> = Signal.State<T> | Signal.Computed<T>;
export class SignalObserver {
  private __cb;
  constructor(cb: () => void, states?: AnySignal<any>[]) {
    if (states && states.length) {
      this.__cb = () => {
        for (const s of states) {
          s.get();
        }
        cb();
      };
    } else {
      this.__cb = cb;
    }
  }
  private __off: (() => void) | undefined;
  connect() {
    if (null == this.__off) {
      this.__off = effect(this.__cb);
    }
  }
  disconnect() {
    this.__off?.();
    this.__off = undefined;
  }
  toReactiveController(): ReactiveController {
    return {
      hostConnected: () => {
        this.connect();
      },
      hostDisconnected: () => {
        this.disconnect();
      },
    };
  }
}

export const state_map = <T, R>(state: Signal.State<T>, computation: (v: T) => R) => {
  return new Signal.Computed(() => computation(state.get()));
};

export type StateType<T> = T extends Signal.State<infer R> ? R : never;
export const state_combine = <TS extends Record<string, Signal.State<unknown>>, R>(states: TS, computation: (values: {[key in keyof TS]: StateType<TS[key]>}) => R) => {
  return new Signal.Computed(() => {
    const values = {} as {[key in keyof TS]: StateType<TS[key]>};
    for (const key of obj_props(states)) {
      values[key] = states[key].get() as any;
    }
    return computation(values);
  });
};

/*@__NO_SIDE_EFFECTS__*/
export const effect_state = <
  /** This */
  C extends ReactiveElement,
  /** EventType */
  T extends AnySignal,
>() => {
  return accessor<C, T>((_target, context) => {
    context.addInitializer(function () {
      const observer = new SignalObserver(() => {
        signal?.get();
        this.requestUpdate();
      });
      this.addController({
        hostConnected() {
          observer.connect();
        },
        hostDisconnected() {
          observer.disconnect();
        },
      });
    });
    let signal: T;
    return {
      init: (value) => {
        return (signal = value);
      },
      get: () => {
        return signal;
      },
      set: (value) => {
        signal = value;
      },
    };
  });
};
