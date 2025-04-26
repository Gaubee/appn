export class MinNavigationCurrentEntryChangeEvent extends Event implements NavigationCurrentEntryChangeEvent {
  constructor(public __init: NavigationCurrentEntryChangeEventInit) {
    super('currententrychange', __init);
  }
  get navigationType(): NavigationTypeString | null {
    return this.__init.navigationType ?? null;
  }
  get from(): NavigationHistoryEntry {
    return this.__init.from;
  }
}
