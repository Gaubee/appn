import type {MinNavigationEntryInit} from './navigation-history-entry';

export class MinNavigationDestination implements NavigationDestination {
  get id(): string {
    return this.__init.id;
  }
  get index(): number {
    return this.__init.index;
  }
  get key(): string {
    return this.__init.key;
  }
  get sameDocument(): boolean {
    return true;
  }
  get url(): string {
    return this.__init.url;
  }

  getState(): unknown {
    return this.__init.state;
  }
  constructor(readonly __init: MinNavigationEntryInit) {}
}
