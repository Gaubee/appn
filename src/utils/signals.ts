import {Signal} from 'signal-polyfill';
import {effect} from 'signal-utils/subtle/microtask-effect';
export {Signal};
export class SignalObserver {
  private __cb;
  constructor(cb: () => void, states?: Signal.State<any>[]) {
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
}
