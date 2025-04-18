import '@virtualstate/navigation/polyfill';
import 'urlpattern-polyfill';

import {CssSheetArray} from '@gaubee/web';
import {ContextProvider, provide} from '@lit/context';
import {html, LitElement} from 'lit';
import {customElement, property, queryAssignedElements} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {match, Pattern} from 'ts-pattern';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {baseurl_relative_parts} from '../../utils/relative-path';
import {safeProperty} from '../../utils/safe-property';
import {enumToSafeConverter} from '../../utils/safe-property/enum-to-safe-converter';
import '../css-starting-style/css-starting-style';
import {appnNavigationContext, appnNavigationHistoryEntryContext, type AppnNavigation} from './appn-navigation-context';
import {
  appnNavigationHistoryEntryStyle,
  appnNavigationStyle,
  pageFutureOpacity,
  pageFutureScaleX,
  pageFutureScaleY,
  pageFutureTranslateX,
  pageFutureTranslateY,
} from './appn-navigation.css';

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
  private __previousEntry: NavigationHistoryEntry | null = null;
  private __currentEntry: NavigationHistoryEntry | null = this.__nav.currentEntry;
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
      this.__previousEntry = this.__nav.currentEntry;
      event.intercept({
        handler: () => {
          this.__currentEntry = this.__nav.currentEntry!;
          return this.__effectRoutes(event.navigationType);
        },
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

  #currentEntryIndex = -1; //this.currentEntry ? this.__nav.entries().indexOf(this.currentEntry) : -1;
  get currentEntryIndex() {
    return this.#currentEntryIndex;
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
  //#endregion

  @queryAssignedElements({slot: 'router', flatten: true})
  accessor routersElements!: HTMLTemplateElement[];

  /**
   * 将 NavigationHistoryEntry[] 映射到元素里
   */
  private __effectRoutes = async (navigationType?: NavigationTypeString) => {
    const sharedElementMap = new Map<string, HTMLElement>();
    const effectRoutes = async (mode: 'prepare' | 'enter' | 'finished') => {
      const routersElements = this.routersElements.filter((ele) => ele instanceof HTMLTemplateElement);
      const allEntries = this.__nav.entries();
      const currentEntry = mode === 'prepare' ? this.__previousEntry : this.__currentEntry;
      console.log(this.__previousEntry?.url);
      console.log(this.__currentEntry?.url);
      const currentEntryIndex = currentEntry ? allEntries.indexOf(currentEntry) : -1;
      this.#currentEntryIndex = currentEntryIndex;
      if (currentEntryIndex === -1) {
        return;
      }
      for (const navEntry of allEntries) {
        await this.__effectRoute(navEntry, routersElements, {
          allEntries,
          previousEntry: this.__previousEntry,
          currentEntry,
          currentEntryIndex,
          navigationType,
          mode,
          sharedElementMap,
        });
      }
    };
    await effectRoutes('prepare');
    const tran = document.startViewTransition(() => {
      return effectRoutes('enter');
    });
    await tran.finished;
    await effectRoutes('finished');

    // effectRoutes();
  };

  private __effectRoute = async (
    navEntry: NavigationHistoryEntry,
    routersElements: HTMLTemplateElement[],
    context: {
      allEntries: NavigationHistoryEntry[];
      previousEntry: NavigationHistoryEntry | null;
      currentEntry: NavigationHistoryEntry | null;
      currentEntryIndex: number;
      navigationType?: NavigationTypeString;
      mode: 'prepare' | 'enter' | 'finished';
      sharedElementMap: Map<string, HTMLElement>;
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

    const sharedElementPagesContext: {
      previousEntryNode?: AppnNavigationHistoryEntryElement;
      currentEntryNode?: AppnNavigationHistoryEntryElement;
    } = {};
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
              .otherwise(() => {
                console.warn(`no found templateElement by id: ${JSON.stringify(routerElement.dataset.target)}`);
                return null;
              })
          : routerElement;
        // 找不到模板元素
        if (!templateElement) break;

        const oldNavHistoryEntryNode = this.querySelector<AppnNavigationHistoryEntryElement>(`appn-navigation-history-entry[data-index="${navEntry.index}"]`);
        let navHistoryEntryNode: AppnNavigationHistoryEntryElement;
        if (context.mode === 'finished') {
          if (!oldNavHistoryEntryNode) {
            break;
          }
          navHistoryEntryNode = oldNavHistoryEntryNode;
        } else {
          if (oldNavHistoryEntryNode) {
            navHistoryEntryNode = oldNavHistoryEntryNode;
            oldNavHistoryEntryNode.navigationEntry = navEntry;
            if (oldNavHistoryEntryNode.templateEle !== templateElement) {
              oldNavHistoryEntryNode.templateEle = templateElement;
              oldNavHistoryEntryNode.hash = relative_parts.hash;
              oldNavHistoryEntryNode.innerHTML = '';
              oldNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
            }
          } else {
            const newNavHistoryEntryNode = new AppnNavigationHistoryEntryElement();
            navHistoryEntryNode = newNavHistoryEntryNode;
            newNavHistoryEntryNode.navigationEntry = navEntry;
            newNavHistoryEntryNode.templateEle = templateElement;
            newNavHistoryEntryNode.pathname = relative_parts.pathname;
            newNavHistoryEntryNode.search = relative_parts.search;
            newNavHistoryEntryNode.hash = relative_parts.hash;
            newNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
          }

          navHistoryEntryNode.navigationType = context.navigationType ?? null; // 它可能一开始的时候就在 future 里，所以 navigationType 默认为 null
          navHistoryEntryNode.presentEntryIndex = context.currentEntryIndex;

          if (!navHistoryEntryNode.parentElement) {
            // 这里await一下，是给自定义元素完成自己的生命周期留时间
            await this.appendChild(navHistoryEntryNode);
          }
        }

        if (navEntry.key === context.currentEntry?.key) {
          sharedElementPagesContext.currentEntryNode = navHistoryEntryNode;
        }
        if (navEntry.key === context.previousEntry?.key) {
          sharedElementPagesContext.previousEntryNode = navHistoryEntryNode;
        }

        break;
      }
    }
    /// 最后，处理过渡元素
    if (context.mode === 'finished') {
      for (const navHistoryEntryNode of [sharedElementPagesContext.currentEntryNode, sharedElementPagesContext.previousEntryNode]) {
        if (navHistoryEntryNode) {
          const sharedElements = navHistoryEntryNode.querySelectorAll<HTMLElement>('[data-shared-element],[data-shared-element-old],[data-shared-element-new]');
          /// 清理所有 viewTransitionName
          navHistoryEntryNode.style.viewTransitionName = '';
          for (const sharedElement of sharedElements) {
            sharedElement.style.viewTransitionName = '';
          }
        }
      }
    } else if (context.mode === 'prepare') {
      for (const navHistoryEntryNode of [sharedElementPagesContext.currentEntryNode]) {
        if (navHistoryEntryNode) {
          const sharedElements = navHistoryEntryNode.querySelectorAll<HTMLElement>('[data-shared-element],[data-shared-element-old],[data-shared-element-new]');
          const appnNavVtn = (navHistoryEntryNode.style.viewTransitionName = 'appn-' + navEntry.index);
          this.sharedElementCss.setRule(`group(${appnNavVtn})`, `::view-transition-group(${appnNavVtn}){z-index:${navEntry.index};}`);
          for (const sharedElement of sharedElements) {
            const {dataset} = sharedElement;
            const vtn = dataset.sharedElementOld || dataset.sharedElement || '';
            this.__setSharedElement(vtn, sharedElement, context.sharedElementMap);
          }
        }
      }
    } else if (context.mode === 'enter') {
      for (const navHistoryEntryNode of [sharedElementPagesContext.previousEntryNode, sharedElementPagesContext.currentEntryNode]) {
        if (navHistoryEntryNode) {
          const sharedElements = navHistoryEntryNode.querySelectorAll<HTMLElement>('[data-shared-element],[data-shared-element-old],[data-shared-element-new]');
          const appnNavVtn = (navHistoryEntryNode.style.viewTransitionName = 'appn-' + navEntry.index);
          this.sharedElementCss.setRule(`group(${appnNavVtn})`, `::view-transition-group(${appnNavVtn}){z-index:${navEntry.index};}`);
          for (const sharedElement of sharedElements) {
            const {dataset} = sharedElement;
            const vtn = dataset.sharedElementNew || dataset.sharedElement || '';
            this.__setSharedElement(vtn, sharedElement, context.sharedElementMap);
          }
        }
      }
    }
  };

  sharedElementCss = new CssSheetArray();
  private __setSharedElement(vtn: string, element: HTMLElement, sharedElementMap: Map<string, HTMLElement>) {
    if (vtn) {
      const oldElement = sharedElementMap.get(vtn);
      if (oldElement) {
        oldElement.style.viewTransitionName = '';
      }
      element.style.viewTransitionName = vtn;
      sharedElementMap.set(vtn, element);
      const dataset = element.dataset;
      const cssText = dataset.sharedElementStyle;
      if (cssText) {
        this.sharedElementCss.setRule(`group(${vtn})`, `::view-transition-group(${vtn}){${cssText}}`);
      }
      const oldCssText = dataset.sharedElementOldStyle;
      if (oldCssText) {
        this.sharedElementCss.setRule(`old(${vtn})`, `::view-transition-old(${vtn}){${oldCssText}}`);
      }
      const newCssText = dataset.sharedElementNewStyle;
      if (newCssText) {
        this.sharedElementCss.setRule(`new(${vtn})`, `::view-transition-new(${vtn}){${newCssText}}`);
      }
    }
  }

  override render() {
    return this.__html;
  }
  private __html = cache(html`
    <slot name="router" @slotchange=${() => this.__effectRoutes()}></slot>
    <slot></slot>
    <css-starting-style
      slotted=""
      selector="appn-navigation-history-entry[data-tense='present'][data-from-tense='future']"
      cssText="--page-translate-x: ${pageFutureTranslateX};--page-translate-y: ${pageFutureTranslateY};--page-scale-x: ${pageFutureScaleX};--page-scale-y: ${pageFutureScaleY};--page-opacity: ${pageFutureOpacity};"
    ></css-starting-style>
  `);
}

//#region appn-navigation-history-entry

const _NAVIGATION_HISTORY_ENTRY_TENSE_ENUM_VALUES = [undefined, 'past', 'present', 'future'] as const;
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
  @safeProperty(enumToSafeConverter([null, 'reload', 'push', 'replace', 'traverse']))
  accessor navigationType: NavigationTypeString | null = null;
  @property({type: Number, reflect: true, attribute: true})
  accessor presentEntryIndex = -1;
  @provide({context: appnNavigationHistoryEntryContext})
  accessor navigationEntry: NavigationHistoryEntry | null = null;

  override render() {
    this.dataset.key = this.navigationEntry?.key;
    /** 自身 index */
    const selfIndex = this.navigationEntry?.index ?? -1;
    /** 当前 NavigationHistoryEntry 的 index */
    const presentIndex = this.presentEntryIndex;
    this.style.setProperty('--index', (this.dataset.index = `${selfIndex}`));
    this.style.setProperty('--present-index', `${presentIndex}`);

    let fromTense = this.dataset.tense as NavigationHistoryEntryTense;
    /**
     * 如果 present 在最后，那么：
     *
     * curr:  ...past | past    | PRESENT
     * from:  ...past | PRESENT | future
     * diff:    -2    | -1      | 0
     *
     * ---
     *
     * navigationType === 'push'，那么：
     *
     * curr:        ...past | past    | PRESENT | future  | future...
     * from-enter:  ...past | PRESENT | future  | future  | future...
     * diff-enter:  -2      | -1      | 0       | +1      | +2
     *
     * from-back:   ...past | past   | past     | PRESENT | future...
     * diff-back:   -2      | -1     | 0        | +1      | +2
     *
     */
    if (fromTense == null) {
      const pos = match(this.navigationType)
        .with('push', () => 1)
        .with('traverse', () => -1)
        .otherwise(() => 0);
      if (selfIndex > presentIndex - pos) {
        fromTense = 'future';
      } else if (selfIndex < presentIndex - pos) {
        // presentIndex - 1
        fromTense = 'past';
      } else {
        fromTense = 'present';
      }
    }
    this.dataset.fromTense = fromTense;

    const tense: NavigationHistoryEntryTense =
      presentIndex === -1
        ? undefined
        : match(selfIndex)
            .with(presentIndex, () => 'present' as const)
            .otherwise(() => (selfIndex < presentIndex ? 'past' : 'future'));
    this.dataset.tense = tense;

    // const vtn = `vtn-${selfIndex}`;
    // this.style.setProperty('--view-transition-name', vtn);
    this.inert = tense !== 'present';

    return html`<slot></slot>`;
  }
}

//#endregion

//#region global-type
declare global {
  interface HTMLElementTagNameMap {
    'appn-navigation-provider': AppnNavigationProviderElement;
    'appn-navigation-history-entry': AppnNavigationHistoryEntryElement;
  }
}
//#endregion
