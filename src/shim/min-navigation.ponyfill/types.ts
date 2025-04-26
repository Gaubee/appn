export interface NavigationBase extends EventTarget {
  /** Returns a snapshot of the joint session history entries. */
  entries(): NavigationHistoryEntry[];

  /** The current NavigationHistoryEntry. */
  readonly currentEntry: NavigationHistoryEntry | null;
  // /** The index of current NavigationHistoryEntry. */
  // readonly currentEntryIndex: number;
  /** Updates the state object of the current NavigationHistoryEntry. */
  updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions): void;

  /** Represents the currently ongoing navigation or null if none. */
  readonly transition: NavigationTransition | null;

  //   /** Represents the activation details if the navigation was triggered by same-origin prerendering or bfcache restoration. */
  //   readonly activation: NavigationActivation | null;
  /** Indicates if it's possible to navigate backwards. */
  readonly canGoBack: boolean;

  /** Indicates if it's possible to navigate forwards. */
  readonly canGoForward: boolean;

  /** Navigates to the specified URL. */
  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult;

  /** Reloads the current entry. */
  reload(options?: NavigationReloadOptions): NavigationResult;

  /** Navigates to a specific history entry identified by its key. */
  traverseTo(key: string, options?: NavigationOptions): NavigationResult;

  /** Navigates back one entry in the joint session history. */
  back(options?: NavigationOptions): NavigationResult;

  /** Navigates forward one entry in the joint session history. */
  forward(options?: NavigationOptions): NavigationResult;

  addEventListener<K extends keyof NavigationEventMap>(
    type: K,
    listener: (this: NavigationBase, ev: NavigationEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof NavigationEventMap>(
    type: K,
    listener: (this: NavigationBase, ev: NavigationEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
