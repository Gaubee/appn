import {ContextProvider, provide} from '@lit/context';
import {css, html, LitElement, type CSSResultGroup, type PropertyValues} from 'lit';
import {customElement, property, query, queryAssignedElements} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {appnNavigationContext, appnNavigationHistoryEntryContext, type AppnNavigation} from './appn-navigation-context';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import type {AppnPageElement} from '../appn-page/appn-page';
import {appnNavigationStyle} from './appn-navigation.css';
import {MutationController} from '../../utils/mutation-controller';
import {URLPattern} from 'urlpattern-polyfill';
import {baseurl_relative_parts} from '../../utils/relative-path';
import {match, Pattern} from 'ts-pattern';

@customElement('appn-navigation-provider')
export class AppnNavigationProviderElement extends LitElement implements AppnNavigation {
  static override styles = appnNavigationStyle;
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
      // event.preventDefault();
      event.intercept({
        handler: this.__effectRoutes,
      });
      // debugger;
      // this.dispatchEvent(event);
      // debugger;
    });
    // this.__nav.addEventListener('navigatesuccess', (event) => {
    //   debugger;
    //   this.dispatchEvent(event);
    //   debugger;
    // });
    // this.__nav.addEventListener('navigateerror', (event) => {
    //   debugger;
    //   this.dispatchEvent(event);
    //   debugger;
    // });
    debugger;
    this.__nav.addEventListener('currententrychange', (event) => {
      debugger;
      this.currentEntry = this.__nav.currentEntry;
    });
  }

  /** Returns a snapshot of the joint session history entries. */
  async entries(): Promise<NavigationHistoryEntry[]> {
    return this.__nav.entries();
  }

  async findEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>) {
    for (const entry of this.__nav.entries()) {
      const found = match(entry)
        .with(pattern, (entry) => entry)
        .otherwise(() => null);
      if (found) return found;
    }
    return null;
  }

  // /** The current NavigationHistoryEntry. */
  // get currentEntry() {
  //   return this.__nav.currentEntry;
  // }

  @provide({context: appnNavigationHistoryEntryContext})
  accessor currentEntry: NavigationHistoryEntry | null = this.__nav.currentEntry;

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

  @property({type: String, reflect: true, attribute: 'base-uri'})
  override accessor baseURI = location.href;

  @queryAssignedElements({slot: 'router', flatten: true})
  accessor routersElements!: HTMLTemplateElement[];

  /**
   * 将 NavigationHistoryEntry[] 映射到元素里
   */
  private __effectRoutes = async () => {
    const routersElements = this.routersElements.filter((ele) => ele instanceof HTMLTemplateElement);
    console.log('QAQ routersElements', routersElements);
    for (const navEntry of await this.entries()) {
      this.__effectRoute(navEntry, routersElements);
    }
  };
  private __effectRoute = (navEntry: NavigationHistoryEntry, routersElements: HTMLTemplateElement[]) => {
    const current_url = navEntry.url;
    if (!current_url) {
      return;
    }
    const relative_parts = baseurl_relative_parts(current_url, this.baseURI);
    if (!relative_parts) {
      return;
    }
    console.log('QAQ relative_parts', relative_parts);
    for (const routerElement of routersElements) {
      const {pathname = '*', search = '*', hash = '*'} = routerElement.dataset;
      const p = new URLPattern({pathname, search, hash});
      const matchResult = p.exec(relative_parts);
      console.log('QAQ', {pathname, search, hash});
      if (matchResult) {
        console.log('QAQ matchResult', matchResult);
        const templateElement = routerElement.dataset.target
          ? match(routerElement.ownerDocument.getElementById(routerElement.dataset.target))
              .when(
                (ele) => ele instanceof HTMLTemplateElement,
                (ele) => ele
              )
              .otherwise(() => null)
          : routerElement;
        if (templateElement) {
          const oldNavHistoryEntryNode = this.querySelector<AppnNavigationHistoryEntryElement>(
            `appn-navigation-history-entry[pathname=${JSON.stringify(pathname)}][search=${JSON.stringify(search)}]`
          );
          if (oldNavHistoryEntryNode) {
            oldNavHistoryEntryNode.navigationEntry = navEntry;
            if (oldNavHistoryEntryNode.templateEle !== templateElement) {
              oldNavHistoryEntryNode.templateEle = templateElement;
              oldNavHistoryEntryNode.hash = relative_parts.hash;
              oldNavHistoryEntryNode.innerHTML = '';
              oldNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
            }
            this.appendChild(oldNavHistoryEntryNode);
          } else {
            const newNavHistoryEntryNode = new AppnNavigationHistoryEntryElement();
            newNavHistoryEntryNode.navigationEntry = navEntry;
            newNavHistoryEntryNode.templateEle = templateElement;
            newNavHistoryEntryNode.pathname = relative_parts.pathname;
            newNavHistoryEntryNode.search = relative_parts.search;
            newNavHistoryEntryNode.hash = relative_parts.hash;
            newNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
            this.appendChild(newNavHistoryEntryNode);
          }
        }
        break;
      }
    }
  };

  override render() {
    return this.__html;
  }
  private __html = cache(html`
    <slot name="router" @slotchange=${this.__effectRoutes}></slot>
    <slot></slot>
  `);
}

@customElement('appn-navigation-history-entry')
export class AppnNavigationHistoryEntryElement extends LitElement {
  static override styles = [
    css`
      :host {
        display: grid;
      }
    `,
  ];
  @property({type: String, reflect: true, attribute: true})
  accessor pathname!: string;
  @property({type: String, reflect: true, attribute: true})
  accessor search!: string;
  @property({type: String, reflect: true, attribute: true})
  accessor hash!: string;
  @property({type: Object})
  accessor templateEle: HTMLTemplateElement | undefined = undefined;

  @provide({context: appnNavigationHistoryEntryContext})
  accessor navigationEntry: NavigationHistoryEntry | null = null;
  override render() {
    return html`<slot></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-navigation-provider': AppnNavigationProviderElement;
    'appn-navigation-history-entry': AppnNavigationHistoryEntryElement;
  }
}
