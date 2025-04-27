export interface startSharedElementTransiton {
  (rootElement: Element): SharedElementTransition;
}
/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition) */
interface SharedElementTransition {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/finished) */
  readonly finished: Promise<void>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/ready) */
  readonly ready: Promise<void>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/updateCallbackDone) */
  readonly updateCallbackDone: Promise<void>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/skipTransition) */
  skipTransition(): void;
}

interface SharedElementStyles {
  group: string;
  old: string;
  new: string;
}

export interface defineSharedElement {
  (element: Element, sharedName: string, styles: SharedElementStyles): void;
}

export interface unsetSharedElement {
  (element: Element): void;
}
