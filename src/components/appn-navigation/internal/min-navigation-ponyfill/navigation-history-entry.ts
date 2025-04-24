import {event, type PropertyEventListener} from '../../../../utils/event-property';

export class MinNavigationHistoryEntry extends EventTarget implements NavigationHistoryEntry {
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
  __getInit() {
    return this.__init;
  }
  __setState(state: unknown) {
    this.__init.state = state;
  }

  @event()
  accessor ondispose!: PropertyEventListener<NavigationHistoryEntry, Event>;

  constructor(private __init: MinNavigationEntryInit) {
    super();
  }
}
export interface MinNavigationEntryInit {
  id: string;
  index: number;
  key: string;
  url: string;
  state: unknown;
  sessionKey: string;
}
