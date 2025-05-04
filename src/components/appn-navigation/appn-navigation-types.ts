import type {Pattern} from 'ts-pattern';
import type {NavigationBase} from '../../shim/navigation.native/types';
import type {AppnNavigationProviderElement} from './appn-navigation';
export interface AppnNavigation<T extends AppnNavigation<any> = AppnNavigationProviderElement> extends NavigationBase {
  readonly baseURI: string;

  findFirstEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null): NavigationHistoryEntry | null;
  findLastEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null): NavigationHistoryEntry | null;

  // Event Handlers (using specific event types is better if available)
  onnavigate: ((this: T, ev: NavigateEvent) => void) | null;
  onnavigatesuccess: ((this: T, ev: Event) => void) | null; // Replace Event with specific success event type if known
  onnavigateerror: ((this: T, ev: ErrorEvent) => void) | null; // Replace ErrorEvent with specific error event type if known
  oncurrententrychange: ((this: T, ev: NavigationCurrentEntryChangeEvent) => void) | null;
}
