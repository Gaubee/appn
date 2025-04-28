/// <reference types="@types/dom-navigation"/>
export const caniuseNavigation = 'navigation' in self;
/**
 * > 与 NavigationAPI 基本保持一致的类型定义，这里独立定义一份，原因有3:
 * > 1. 原本的 Navigation 是 class 定义，这里改成用 interface，同时增强通用性质，方便polyfill的实现
 * > 2. 少量的裁剪(`on*` 属性)。
 * > 3. 避免 @types/dom-navigation 发生更新追加新的功能，导致编译问题
 */
export interface NavigationBase extends EventTarget {
  // activation?: NavigationActivation | null;
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

  addEventListener<K extends keyof NavigationEventMap>(type: K, listener: (this: this, ev: NavigationEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof NavigationEventMap>(type: K, listener: (this: this, ev: NavigationEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
