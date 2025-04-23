export const navigation = new (class MinNavigation extends EventTarget {
  #entries: NavigationHistoryEntry[] = [];
  entries(): NavigationHistoryEntry[] {
    throw new Error('Method not implemented.');
  }
  currentEntry: NavigationHistoryEntry | null = null;
  updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions): void {
    throw new Error('Method not implemented.');
  }
  transition: NavigationTransition | null = null;
  get canGoBack() {
    const {currentEntry} = this;
    const entries = this.entries();
    if (!currentEntry || entries.length === 0) {
      return false;
    }
    return currentEntry.index < entries.at(0)!.index;
  }
  get canGoForward() {
    const {currentEntry} = this;
    const entries = this.entries();
    if (!currentEntry || entries.length === 0) {
      return false;
    }
    return currentEntry.index < entries.at(-1)!.index;
  }
  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult {
    throw new Error('Method not implemented.');
  }
  reload(options?: NavigationReloadOptions): NavigationResult {
    throw new Error('Method not implemented.');
  }
  traverseTo(key: string, options?: NavigationOptions): NavigationResult {
    throw new Error('Method not implemented.');
  }
  back(options?: NavigationOptions): NavigationResult {
    throw new Error('Method not implemented.');
  }
  forward(options?: NavigationOptions): NavigationResult {
    throw new Error('Method not implemented.');
  }
})();

export class NavigateEvent extends Event {
  constructor(type: 'navigate', eventInit?: NavigateEventInit) {
    super(type, eventInit);
    if (!eventInit) {
      throw new TypeError('init required');
    }
    if (!eventInit.destination) {
      throw new TypeError('destination required');
    }
    if (!eventInit.signal) {
      throw new TypeError('signal required');
    }
    this.canIntercept = this.canTransition = eventInit.canIntercept ?? false;
    this.destination = eventInit.destination;
    this.downloadRequest = eventInit.downloadRequest || null;
    this.formData = eventInit.formData || null;
    this.hashChange = eventInit.hashChange ?? false;
    this.info = eventInit.info;
    this.signal = eventInit.signal;
    this.userInitiated = eventInit.userInitiated ?? false;
    this.navigationType = eventInit.navigationType ?? 'push';
  }

  readonly navigationType: NavigationTypeString;
  readonly canIntercept: boolean;
  /**@deprecated use canIntercept */
  readonly canTransition: boolean;
  readonly userInitiated: boolean;
  readonly hashChange: boolean;
  readonly hasUAVisualTransition: boolean = false;
  readonly destination: NavigationDestination;
  readonly signal: AbortSignal;
  readonly formData: FormData | null;
  readonly downloadRequest: string | null;
  readonly info?: unknown;

  intercept(options?: NavigationInterceptOptions): void {
    // TODO
  }
  scroll(): void {
    // TODO remeber scroll position in sessionStorage
  }
}
