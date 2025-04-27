import 'urlpattern-polyfill';

import {iter_map_not_null, math_clamp} from '@gaubee/util';
import {ContextProvider, provide} from '@lit/context';
import {html, LitElement} from 'lit';
import {customElement, property, queryAssignedElements} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {match, P, Pattern} from 'ts-pattern';
import type {NavigationBase} from '../../shim/navigation.native/types';
import {sharedElementNative} from '../../shim/shared-element.native';
import type {SharedElementLifecycle} from '../../shim/shared-element.native/types';
import {getFlags} from '../../utils/env';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {baseurl_relative_parts} from '../../utils/relative-path';
import {safeProperty} from '../../utils/safe-property';
import {enumToSafeConverter} from '../../utils/safe-property/enum-to-safe-converter';
import {AppnPageElement, type AppnSwapbackInfo} from '../appn-page/appn-page';
import '../css-starting-style/css-starting-style';
import {appnNavigationContext, appnNavigationHistoryEntryContext} from './appn-navigation-context';
import type {AppnNavigation} from './appn-navigation-types';
import {
  appnNavigationHistoryEntryStyle,
  appnNavigationStyle,
  pageFutureOpacity,
  pageFutureScaleX,
  pageFutureScaleY,
  pageFutureTranslateX,
  pageFutureTranslateY,
} from './appn-navigation.css';

export type ViewTransitionLifecycle = 'prepare' | 'started' | 'finished';

const APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES = [null, 'horizontal', 'vertical'] as const;
export type AppnNavigationStackDirection = (typeof APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES)[number];

const enable_min_navigation_ponyfill = getFlags().has('min-navigation');
// const enable_shared_element_ponyfill = getFlags().has('shared-element');

const navApi: NavigationBase =
  enable_min_navigation_ponyfill || !window.navigation
    ? // mini ponyfill
      await import('../../shim/min-navigation.ponyfill/index').then((r) => r.navigation)
    : // native support
      window.navigation;

/**
 * @attr {boolean} stack - enable stack view mode
 * @attr {AppnNavigationStackDirection} stack-direction - The direction of the navigation stack.
 */
@customElement('appn-navigation-provider')
export class AppnNavigationProviderElement extends LitElement implements AppnNavigation {
  static override styles = appnNavigationStyle;
  static nav = navApi;

  //#region AppnNavigation
  private __previousEntry: NavigationHistoryEntry | null = null;
  private __currentEntry: NavigationHistoryEntry | null = navApi.currentEntry;
  constructor() {
    super();
    new ContextProvider(this, {
      context: appnNavigationContext,
      initialValue: this,
    });
    /// 这里独立写，是为了方便调试
    navApi.addEventListener('navigate', (event) => {
      if (!event.canIntercept) {
        return;
      }
      event.info;
      this.__previousEntry = navApi.currentEntry;
      event.intercept({
        handler: () => {
          this.__currentEntry = navApi.currentEntry!;
          return this.__effectRoutes(event.navigationType, event.info);
        },
      });
    });
    navApi.addEventListener('currententrychange', (_event) => {
      this.currentEntry = navApi.currentEntry;
    });
  }

  @property({type: String, reflect: true, attribute: 'base-uri'})
  override accessor baseURI: string = location.href;
  /** Returns a snapshot of the joint session history entries. */
  entries(): NavigationHistoryEntry[] {
    const entries = navApi.entries();
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
  //   return navApi.currentEntry;
  // }

  @provide({context: appnNavigationHistoryEntryContext})
  accessor currentEntry: NavigationHistoryEntry | null = navApi.currentEntry;

  #currentEntryIndex = -1; //this.currentEntry ? navApi.entries().indexOf(this.currentEntry) : -1;
  get currentEntryIndex() {
    return this.#currentEntryIndex;
  }

  /** Updates the state object of the current NavigationHistoryEntry. */
  updateCurrentEntry(options: NavigationUpdateCurrentEntryOptions): void {
    navApi.updateCurrentEntry(options);
  }

  /** Represents the currently ongoing navigation or null if none. */
  get transition(): NavigationTransition | null {
    return navApi.transition;
  }

  /** Indicates if it's possible to navigate backwards. */
  get canGoBack(): boolean {
    return navApi.canGoBack;
  }

  /** Indicates if it's possible to navigate forwards. */
  get canGoForward(): boolean {
    return navApi.canGoForward;
  }

  /** Navigates to the specified URL. */
  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult {
    return navApi.navigate(url, options);
  }

  /** Reloads the current entry. */
  reload(options?: NavigationReloadOptions): NavigationResult {
    return navApi.reload(options);
  }

  /** Navigates to a specific history entry identified by its key. */
  traverseTo(key: string, options?: NavigationOptions): NavigationResult {
    return navApi.traverseTo(key, options);
  }

  /** Navigates back one entry in the joint session history. */
  back(options?: NavigationOptions): NavigationResult {
    return navApi.back(options);
  }

  /** Navigates forward one entry in the joint session history. */
  forward(options?: NavigationOptions): NavigationResult {
    return navApi.forward(options);
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

  //#region navigate effectRoutes
  /**
   * 将 NavigationHistoryEntry[] 映射到元素里
   */
  private __effectRoutes = async (navigationType?: NavigationTypeString, info?: unknown) => {
    /**
     * 手势返回模式
     */
    const swapbackInfo = match(info)
      .with({by: 'swapback', start: P.instanceOf(Touch), page: P.instanceOf(AppnPageElement)}, (info) => info satisfies AppnSwapbackInfo)
      .otherwise(() => null);

    /**
     * 所有`<appn-nabigation-history-entry>`元素索引
     */
    const allNavHistoryEntryNodeMap = new Map<number, AppnNavigationHistoryEntryElement>();
    {
      for (const node of this.querySelectorAll<AppnNavigationHistoryEntryElement>(`appn-navigation-history-entry`)) {
        const index = node.dataset.index;
        if (index) {
          allNavHistoryEntryNodeMap.set(+index, node);
        }
      }
    }
    /**
     * 存储那些没有被使用到的`<appn-nabigation-history-entry>`元素，在finished的时候会被移除掉
     */
    const unuseEntryNodes = new Set(allNavHistoryEntryNodeMap.values());

    const effectRoutes = async (lifecycle: SharedElementLifecycle) => {
      const routersElements = this.routersElements.filter((ele) => ele instanceof HTMLTemplateElement);
      const allEntries = await navApi.entries();
      const currentEntry = lifecycle === 'first' ? this.__previousEntry : this.__currentEntry;
      const currentEntryIndex = currentEntry ? allEntries.indexOf(currentEntry) : -1;
      this.#currentEntryIndex = currentEntryIndex;
      if (currentEntryIndex === -1) {
        return;
      }
      this.style.setProperty('--present-index', `${currentEntryIndex}`);

      // TODO 未来 mode === 'finished' 时，需要通知元素生命周期
      if (lifecycle !== 'finish') {
        for (const navEntry of allEntries) {
          const ele = await this.__effectRoute(navEntry, routersElements, allNavHistoryEntryNodeMap, {
            allEntries,
            currentEntry,
            currentEntryIndex,
            navigationType,
          });
          if (ele) {
            unuseEntryNodes.delete(ele);
          }
        }
      } else {
        // 移除废弃的元素
        for (const ele of unuseEntryNodes) {
          ele.remove();
        }
      }
      sharedElementNative.effectPagesSharedElement(this, {
        previousEntry: this.__previousEntry,
        subsequentEntry: this.__currentEntry,
        lifecycle,
      });
    };
    const sharedElementCss = sharedElementNative.css;
    if (swapbackInfo) {
      sharedElementCss.setAnimation('linear');
    } else {
      sharedElementCss.setAnimation();
    }

    sharedElementNative.transition({
      first: () => effectRoutes('first'),
      last: () => effectRoutes('last'),
      start: async (tran) => {
        if (swapbackInfo) {
          const pageWidth = swapbackInfo.page.clientWidth;
          await tran.ready;
          const htmlEle = document.documentElement;
          const onTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0]!;
            const move = touch.clientX - swapbackInfo.start.clientX;
            const p = math_clamp(0, move / pageWidth, 1);
            const currentTime = Math.min(totalDuration * p);
            // console.log('onTouchMove', touch.clientX, swapbackInfo.start.clientX, move, pageWidth, currentTime);
            animations.forEach((ctor) => (ctor.currentTime = currentTime));
          };
          const onTouchEnd = (_e: TouchEvent) => {
            // const touch = e.touches[0]!;
            // const move = touch.clientX - swapbackInfo.start.clientX;
            // console.log('onTouchEnd');
            // if (touch.clientX < pageWidth / 2) {
            //   // TODO cancel
            // }

            // TODO 这里应该支持继续使用原本的动画曲线，viewTransitionCss.setAnimation();
            animations.forEach((ani) => ani.play());
          };
          htmlEle.addEventListener('touchmove', onTouchMove);
          htmlEle.addEventListener('touchend', onTouchEnd);
          tran.finished.finally(() => {
            htmlEle.removeEventListener('touchmove', onTouchEnd);
            htmlEle.removeEventListener('touchend', onTouchMove);
          });

          let totalDuration = 1000;
          const animations = iter_map_not_null(htmlEle.getAnimations({subtree: true}), (ani) => {
            const {effect} = ani;
            if (effect instanceof KeyframeEffect && effect.pseudoElement?.startsWith(sharedElementNative.selectorPrefix)) {
              if (effect.pseudoElement === sharedElementNative.getSelector('group', 'root')) {
                totalDuration = effect.getTiming().duration as number;
              }

              ani.pause();
              return ani as Animation & {effect: KeyframeEffect & {pseudoElement: string}};
            }
            return;
          });
          // @ts-ignore
          globalThis.animationControllers = animations;
          // @ts-ignore
          globalThis.swapbackInfo = swapbackInfo;
        }
      },
      finish: () => effectRoutes('finish'),
    });
  };

  private __effectRoute = async (
    navEntry: NavigationHistoryEntry,
    routersElements: HTMLTemplateElement[],
    allNavHistoryEntryNodeMap: Map<number, AppnNavigationHistoryEntryElement>,
    context: {
      allEntries: NavigationHistoryEntry[];
      currentEntry: NavigationHistoryEntry | null;
      currentEntryIndex: number;
      navigationType?: NavigationTypeString;
    }
  ): Promise<AppnNavigationHistoryEntryElement | undefined> => {
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
              .otherwise(() => {
                console.warn(`no found templateElement by id: ${JSON.stringify(routerElement.dataset.target)}`);
                return null;
              })
          : routerElement;
        // 找不到模板元素
        if (!templateElement) break;

        const oldNavHistoryEntryNode = allNavHistoryEntryNodeMap.get(navEntry.index);
        let navHistoryEntryNode: AppnNavigationHistoryEntryElement;

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
          allNavHistoryEntryNodeMap.set(navEntry.index, newNavHistoryEntryNode);
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

        return navHistoryEntryNode;
      }
    }
    return;
  };
  //#endregion

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
