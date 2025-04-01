import {ContextProvider} from '@lit/context';
import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {appnNavigationContext, type AppnNavigation} from './appn-navigation-context';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
@customElement('appn-navigation-provider')
export class AppnNavigationProviderElement extends LitElement implements AppnNavigation {
  private __nav = window.navigation;
  constructor() {
    super();
    new ContextProvider(this, {
      context: appnNavigationContext,
      initialValue: this,
    });
    /// 这里独立写，是为了方便调试
    this.__nav.addEventListener('navigate', (event) => {
      if (!event.canIntercept) {
        return;
      }
      event.intercept({handler: async () => {}});
      debugger;
      this.dispatchEvent(event);
      debugger;
    });
    this.__nav.addEventListener('navigatesuccess', (event) => {
      debugger;
      this.dispatchEvent(event);
      debugger;
    });
    this.__nav.addEventListener('navigateerror', (event) => {
      debugger;
      this.dispatchEvent(event);
      debugger;
    });
    this.__nav.addEventListener('currententrychange', (event) => {
      debugger;
      this.dispatchEvent(event);
      debugger;
    });
  }

  /** Returns a snapshot of the joint session history entries. */
  entries(): NavigationHistoryEntry[] {
    return this.__nav.entries();
  }

  /** The current NavigationHistoryEntry. */
  get currentEntry() {
    return this.__nav.currentEntry;
  }

  /** Updates the state object of the current NavigationHistoryEntry. */
  updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions): void {
    this.__nav.updateCurrentEntry(options);
  }

  /** Represents the currently ongoing navigation or null if none. */
  get transition(): NavigationTransition | null {
    return this.__nav.transition;
  }

  /** Represents the activation details if the navigation was triggered by same-origin prerendering or bfcache restoration. */
  get activation(): NavigationActivation | null {
    //@ts-ignore
    return this.__nav.activation ?? null;
  }

  /** Indicates if it's possible to navigate backwards. */
  get canGoBack(): boolean {
    return this.__nav.canGoBack;
  }

  /** Indicates if it's possible to navigate forwards. */
  get canGoForward(): boolean {
    return this.__nav.canGoForward;
  }

  /** Navigates to the specified URL. */
  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult {
    return this.__nav.navigate(url, options);
  }

  /** Reloads the current entry. */
  reload(options?: NavigationReloadOptions): NavigationResult {
    return this.__nav.reload(options);
  }

  /** Navigates to a specific history entry identified by its key. */
  traverseTo(key: string, options?: NavigationOptions): NavigationResult {
    return this.__nav.traverseTo(key, options);
  }

  /** Navigates back one entry in the joint session history. */
  back(options?: NavigationOptions): NavigationResult {
    return this.back(options);
  }

  /** Navigates forward one entry in the joint session history. */
  forward(options?: NavigationOptions): NavigationResult {
    return this.__nav.forward(options);
  }

  // Event Handlers (using specific event types is better if available)
  @eventProperty<AppnNavigationProviderElement, NavigateEvent>()
  accessor onnavigate!: PropertyEventListener<AppnNavigationProviderElement, NavigateEvent>;
  @eventProperty<AppnNavigationProviderElement>()
  accessor onnavigatesuccess!: PropertyEventListener<AppnNavigationProviderElement>;
  @eventProperty<AppnNavigationProviderElement, ErrorEvent>()
  accessor onnavigateerror!: PropertyEventListener<AppnNavigationProviderElement, ErrorEvent>;
  @eventProperty<AppnNavigationProviderElement, NavigationCurrentEntryChangeEvent>()
  accessor oncurrententrychange!: PropertyEventListener<AppnNavigationProviderElement, NavigationCurrentEntryChangeEvent>;

  private __html = cache(html`<slot></slot>`);
  override render() {
    return this.__html;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-navigation-provider': AppnNavigationProviderElement;
  }
}
