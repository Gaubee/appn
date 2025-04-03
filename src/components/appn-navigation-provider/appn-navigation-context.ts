/// <reference types="@types/dom-navigation"/>

import {createContext} from '@lit/context';
import type {AppnNavigationProviderElement} from './appn-navigation-provider';
import type {Pattern} from 'ts-pattern';

export interface AppnNavigation<T extends AppnNavigation<any> = AppnNavigationProviderElement> {
  readonly baseURI: string;
  /** Returns a snapshot of the joint session history entries. */
  entries(): Promise<NavigationHistoryEntry[]>;

  findFirstEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null): Promise<NavigationHistoryEntry | null>;
  findLastEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null): Promise<NavigationHistoryEntry | null>;

  /** The current NavigationHistoryEntry. */
  readonly currentEntry: NavigationHistoryEntry | null;

  /** Updates the state object of the current NavigationHistoryEntry. */
  updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions): void;

  /** Represents the currently ongoing navigation or null if none. */
  readonly transition: NavigationTransition | null;

  /** Represents the activation details if the navigation was triggered by same-origin prerendering or bfcache restoration. */
  readonly activation: NavigationActivation | null;

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

  // Event Handlers (using specific event types is better if available)
  onnavigate: ((this: T, ev: NavigateEvent) => any) | null;
  onnavigatesuccess: ((this: T, ev: Event) => any) | null; // Replace Event with specific success event type if known
  onnavigateerror: ((this: T, ev: ErrorEvent) => any) | null; // Replace ErrorEvent with specific error event type if known
  oncurrententrychange: ((this: T, ev: NavigationCurrentEntryChangeEvent) => any) | null;
}

/**
 *
 * require navigation API supports.
 * ```js
 * import "@virtualstate/navigation/polyfill";
 * ```
 */
export const appnNavigationContext = createContext<AppnNavigation<AppnNavigationProviderElement>>(Symbol('appn-navigation'));

export const appnNavigationHistoryEntryContext = createContext<NavigationHistoryEntry | null>(Symbol('appn-navigation-history-entry'));
