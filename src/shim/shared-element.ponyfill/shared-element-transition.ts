import type {SharedElementTransition} from '../shared-element.native/types';

export class SharedElementTransitionPonyfill implements SharedElementTransition {
  private __skipped = false;
  skipTransition(): void {
    if (this.__skipped) {
      return;
    }
    this.__skipped = true;
    this.__skipTransitionCallback();
  }
  constructor(
    readonly finished: Promise<void>,
    readonly ready: Promise<void>,
    readonly updateCallbackDone: Promise<void>,
    readonly __skipTransitionCallback: () => void
  ) {}
}
