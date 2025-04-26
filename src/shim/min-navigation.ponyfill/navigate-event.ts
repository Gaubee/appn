export class MinNavigateEvent extends Event implements NavigateEvent {
  #init;
  constructor(eventInit: NavigateEventInit) {
    super('navigate', eventInit);
    if (!eventInit) {
      throw new TypeError('init required');
    }
    if (!eventInit.destination) {
      throw new TypeError('destination required');
    }
    if (!eventInit.signal) {
      throw new TypeError('signal required');
    }
    this.#init = {
      canIntercept: eventInit.canIntercept ?? false,
      destination: eventInit.destination,
      downloadRequest: eventInit.downloadRequest || null,
      formData: eventInit.formData || null,
      hasUAVisualTransition: false,
      hashChange: eventInit.hashChange ?? false,
      info: eventInit.info,
      signal: eventInit.signal,
      userInitiated: eventInit.userInitiated ?? false,
      navigationType: eventInit.navigationType ?? 'push',
    };
  }

  async __runHandler() {
    const handler = this.#handler;
    if (typeof handler === 'function') {
      await handler.call(this);
    }

    if (this.#focusReset !== 'manual') {
      // TODO focus
    }
    if (this.#scroll !== 'manual') {
      // TODO focus
    }
  }
  get navigationType(): NavigationTypeString {
    return this.#init.navigationType;
  }
  get canIntercept(): boolean {
    return this.#init.canIntercept;
  }
  /**@deprecated use canIntercept */
  get canTransition(): boolean {
    return this.#init.canIntercept;
  }
  get userInitiated(): boolean {
    return this.#init.userInitiated;
  }
  get hashChange(): boolean {
    return this.#init.hashChange;
  }
  get hasUAVisualTransition(): boolean {
    return this.#init.hasUAVisualTransition;
  }
  get destination(): NavigationDestination {
    return this.#init.destination;
  }
  get signal(): AbortSignal {
    return this.#init.signal;
  }
  get formData(): FormData | null {
    return this.#init.formData;
  }
  get downloadRequest(): string | null {
    return this.#init.downloadRequest;
  }
  get info(): unknown {
    return this.#init.info;
  }

  #handler?: () => Promise<void>;
  #focusReset?: 'after-transition' | 'manual';
  #scroll?: 'after-transition' | 'manual';

  intercept(options?: NavigationInterceptOptions): void {
    if (!options) {
      return;
    }
    this.#handler = options.handler;
    this.#focusReset = options.focusReset;
    this.#scroll = options.scroll;
  }
  scroll(): void {
    // TODO remeber scroll position in sessionStorage
  }

  // tryCommit(){
  //   /// 如果没有被劫持，并且事件没有被取消
  //   if(this.#intercepted&&!this.defaultPrevented){
  //     this.__committer.resolve(new MinNavigationHistoryEntry(init));
  //   }
  // }
}
