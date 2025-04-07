import '@virtualstate/navigation/polyfill';
import 'urlpattern-polyfill';

import {ContextProvider, provide} from '@lit/context';
import {html, LitElement} from 'lit';
import {customElement, property, queryAssignedElements} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {match, Pattern} from 'ts-pattern';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {baseurl_relative_parts} from '../../utils/relative-path';
import {enumToSafeConverter, safeProperty} from '../../utils/safe-property-converter';
import {appnNavigationContext, appnNavigationHistoryEntryContext, type AppnNavigation} from './appn-navigation-context';
import {appnNavigationHistoryEntryStyle, appnNavigationStyle} from './appn-navigation.css';

const APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES = [null, 'horizontal', 'vertical'] as const;
export type AppnNavigationStackDirection = (typeof APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES)[number];
/**
 * @attr {boolean} stack - enable stack view mode
 * @attr {AppnNavigationStackDirection} stack-direction - The direction of the navigation stack.
 */
@customElement('appn-navigation-provider')
export class AppnNavigationProviderElement extends LitElement implements AppnNavigation {
  static override styles = appnNavigationStyle;

  //#region AppnNavigation
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
      event.intercept({
        handler: this.__effectRoutes,
      });
    });
    this.__nav.addEventListener('currententrychange', (_event) => {
      this.currentEntry = this.__nav.currentEntry;
    });
  }

  @property({type: String, reflect: true, attribute: 'base-uri'})
  override accessor baseURI: string = location.href;
  /** Returns a snapshot of the joint session history entries. */
  async entries(): Promise<NavigationHistoryEntry[]> {
    const entries = this.__nav.entries();
    const match_entries = entries.filter((entry) => (entry.url ? baseurl_relative_parts(entry.url, this.baseURI) : false));
    return match_entries;
  }

  async findFirstEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null) {
    const entries = await this.entries();
    const startIndex = fromEntry ? entries.indexOf(fromEntry) : 0;
    for (let i = startIndex > 0 ? startIndex : 0; i < entries.length; i++) {
      const entry = entries[i];
      const found = match(entry)
        .with(pattern, (entry) => entry)
        .otherwise(() => null);
      if (found) return found;
    }
    return null;
  }

  async findLastEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null) {
    const entries = await this.entries();
    const startIndex = fromEntry ? entries.indexOf(fromEntry) : entries.length - 1;
    for (let i = startIndex < entries.length ? startIndex : entries.length - 1; i >= 0; i--) {
      const entry = entries[i];
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
    // @ts-expect-error
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
    return this.__nav.back(options);
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

  //#endregion

  //#region stack render
  @property({type: Boolean, reflect: true, attribute: true})
  accessor stack = false;

  @safeProperty({...enumToSafeConverter(APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES), attribute: 'stack-direction'})
  accessor stackDirection: AppnNavigationStackDirection = null;

  // 相机控制方法
  setCamera(x: number, y: number, z: number) {
    this.style.setProperty('--x', `${x}`);
    this.style.setProperty('--y', `${y}`);
    this.style.setProperty('--z', `${z}`);
  }

  @queryAssignedElements({slot: 'router', flatten: true})
  accessor routersElements!: HTMLTemplateElement[];

  /**
   * 将 NavigationHistoryEntry[] 映射到元素里
   */
  private __effectRoutes = async () => {
    const routersElements = this.routersElements.filter((ele) => ele instanceof HTMLTemplateElement);
    const allEntries = this.__nav.entries();
    const currentEntry = this.__nav.currentEntry;
    const currentEntryIndex = currentEntry ? allEntries.indexOf(currentEntry) : -1;
    for (const navEntry of allEntries) {
      this.__effectRoute(navEntry, routersElements, {allEntries, currentEntry, currentEntryIndex});
    }
  };
  private __effectRoute = (
    navEntry: NavigationHistoryEntry,
    routersElements: HTMLTemplateElement[],
    context: {
      allEntries: NavigationHistoryEntry[];
      currentEntry: NavigationHistoryEntry | null;
      currentEntryIndex: number;
    }
  ) => {
    const current_url = navEntry.url;
    if (!current_url) {
      return;
    }
    const relative_parts = baseurl_relative_parts(current_url, this.baseURI);
    if (!relative_parts) {
      return;
    }
    for (const routerElement of routersElements) {
      const {pathname = '*', search = '*', hash = '*'} = routerElement.dataset;
      const p = new URLPattern({pathname, search, hash});
      const matchResult = p.exec(relative_parts);
      if (matchResult) {
        const templateElement = routerElement.dataset.target
          ? match(routerElement.ownerDocument.getElementById(routerElement.dataset.target))
              .when(
                (ele) => ele instanceof HTMLTemplateElement,
                (ele) => ele
              )
              .otherwise(() => null)
          : routerElement;
        if (templateElement) {
          const oldNavHistoryEntryNode = this.querySelector<AppnNavigationHistoryEntryElement>(`appn-navigation-history-entry[data-index="${navEntry.index}"]`);
          let navHistoryEntryNode: AppnNavigationHistoryEntryElement;

          if (oldNavHistoryEntryNode) {
            oldNavHistoryEntryNode.navigationEntry = navEntry;
            if (oldNavHistoryEntryNode.templateEle !== templateElement) {
              oldNavHistoryEntryNode.templateEle = templateElement;
              oldNavHistoryEntryNode.hash = relative_parts.hash;
              oldNavHistoryEntryNode.innerHTML = '';
              oldNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
            }
            navHistoryEntryNode = oldNavHistoryEntryNode;
          } else {
            const newNavHistoryEntryNode = new AppnNavigationHistoryEntryElement();
            newNavHistoryEntryNode.navigationEntry = navEntry;
            newNavHistoryEntryNode.templateEle = templateElement;
            newNavHistoryEntryNode.pathname = relative_parts.pathname;
            newNavHistoryEntryNode.search = relative_parts.search;
            newNavHistoryEntryNode.hash = relative_parts.hash;
            newNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
            navHistoryEntryNode = newNavHistoryEntryNode;
            this.appendChild(navHistoryEntryNode);
          }
          navHistoryEntryNode.presentEntryIndex = context.currentEntryIndex;
        }
        break;
      }
    }
  };
  //#endregion

  override render() {
    return this.__html;
  }
  private __html = cache(html`
    <slot name="router" @slotchange=${this.__effectRoutes}></slot>
    <slot></slot>
  `);
}

const _NAVIGATION_HISTORY_ENTRY_TENSE_ENUM_VALUES = /**@__PURE__ */ [undefined, 'past', 'present', 'future'] as const;
type NavigationHistoryEntryTense = (typeof _NAVIGATION_HISTORY_ENTRY_TENSE_ENUM_VALUES)[number];

@customElement('appn-navigation-history-entry')
export class AppnNavigationHistoryEntryElement extends LitElement {
  static override styles = appnNavigationHistoryEntryStyle;
  @property({type: String, reflect: true, attribute: true})
  accessor pathname!: string;
  @property({type: String, reflect: true, attribute: true})
  accessor search!: string;
  @property({type: String, reflect: true, attribute: true})
  accessor hash!: string;
  @property({type: Object})
  accessor templateEle: HTMLTemplateElement | undefined = undefined;

  @property({type: Number, reflect: true, attribute: true})
  accessor presentEntryIndex = -1;

  @provide({context: appnNavigationHistoryEntryContext})
  accessor navigationEntry: NavigationHistoryEntry | null = null;
  override render() {
    const index = this.navigationEntry?.index ?? -1;
    this.style.setProperty('--index', (this.dataset.index = `${index}`));
    this.style.setProperty('--present-index', `${this.presentEntryIndex}`);
    const fromTense = this.dataset.tense ?? 'future';
    this.dataset.fromTense = fromTense;
    const tense: NavigationHistoryEntryTense = (this.dataset.tense =
      this.presentEntryIndex === -1
        ? undefined
        : match(index)
            .with(this.presentEntryIndex, () => 'present' as const)
            .otherwise((v) => (v < this.presentEntryIndex ? 'past' : 'future')));
    this.inert = tense !== 'present';

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-navigation-provider': AppnNavigationProviderElement;
    'appn-navigation-history-entry': AppnNavigationHistoryEntryElement;
  }
}
