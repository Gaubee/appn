import type {MinNavigationHistoryEntry} from './navigation-history-entry';

export class MinNavigationTransition implements NavigationTransition {
  constructor(
    private __init: {
      navigationType: NavigationTypeString;
      from: MinNavigationHistoryEntry;
      finished: Promise<void>;
    }
  ) {}

  get navigationType(): NavigationTypeString {
    return this.__init.navigationType;
  }
  get from(): NavigationHistoryEntry {
    return this.__init.from;
  }
  get finished(): Promise<void> {
    return this.__init.finished;
  }
}
