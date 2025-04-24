import type {Pattern} from 'ts-pattern';
import type {AppnNavigationProviderElement} from './appn-navigation';
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
export interface AppnNavigation<T extends AppnNavigation<any> = AppnNavigationProviderElement> extends NavigationBase {
  readonly baseURI: string;

  findFirstEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null): Promise<NavigationHistoryEntry | null>;
  findLastEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null): Promise<NavigationHistoryEntry | null>;

  // Event Handlers (using specific event types is better if available)
  onnavigate: ((this: T, ev: NavigateEvent) => void) | null;
  onnavigatesuccess: ((this: T, ev: Event) => void) | null; // Replace Event with specific success event type if known
  onnavigateerror: ((this: T, ev: ErrorEvent) => void) | null; // Replace ErrorEvent with specific error event type if known
  oncurrententrychange: ((this: T, ev: NavigationCurrentEntryChangeEvent) => void) | null;
}
