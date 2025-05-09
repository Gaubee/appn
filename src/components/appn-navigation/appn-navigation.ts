if (typeof URLPattern !== 'function') {
  await import('urlpattern-polyfill');
}

import {iter_map_not_null, math_clamp} from '@gaubee/util';
import {ContextProvider, provide} from '@lit/context';
import {html, LitElement} from 'lit';
import {customElement, property, queryAssignedElements} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {match, P, Pattern} from 'ts-pattern';
import {caniuseNavigation, type NavigationBase} from '../../shim/navigation.native/types';
import {sharedElement as sharedElementNative, sharedElements} from '../../shim/shared-element.native';
import {caniuseSharedElement, type SharedElementLifecycle} from '../../shim/shared-element.native/types';
import {isSupportTouch} from '../../utils/css-helper';
import {getFlags} from '../../utils/env';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {baseurl_relative_parts} from '../../utils/relative-path';
import {safeProperty} from '../../utils/safe-property';
import {enumToSafeConverter} from '../../utils/safe-property/enum-to-safe-converter';
import {AppnPageElement, type AppnSwapbackInfo} from '../appn-page/appn-page';
import {StaticSharedController} from '../appn-shared-contents/appn-shared-contents-helper';
import type {CommonSharedAbleContentsElement} from '../appn-shared-contents/appn-shared-contents-types';
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

const APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES = [null, 'horizontal', 'vertical'] as const;
export type AppnNavigationStackDirection = (typeof APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES)[number];

const enable_min_navigation_ponyfill = getFlags().has('min-navigation');

const navApi: NavigationBase =
  enable_min_navigation_ponyfill || !caniuseNavigation
    ? // mini ponyfill
      await import('../../shim/min-navigation.ponyfill/index').then((r) => r.minNavigation)
    : // native support
      self.navigation;

const enable_shared_element_ponyfill = getFlags().has('shared-element-ponyfill');

const sharedElement =
  enable_shared_element_ponyfill || !caniuseSharedElement
    ? // shared-element-ponyfill
      await import('../../shim/shared-element.ponyfill/index').then((r) => r.sharedElementPonyfill)
    : // native support
      sharedElementNative;

/**
 * @attr {boolean} stack - enable stack view mode
 * @attr {AppnNavigationStackDirection} stack-direction - The direction of the navigation stack.
 */
@customElement('appn-navigation-provider')
export class AppnNavigationProviderElement extends LitElement implements AppnNavigation {
  static override styles = appnNavigationStyle;
  static nav = navApi;

  //#region AppnNavigation
  constructor() {
    super();
    new ContextProvider(this, {
      context: appnNavigationContext,
      initialValue: this,
    });
    /// 这里独立写，是为了方便调试
    navApi.addEventListener('navigate', (event) => {
      if (!event.canIntercept || event.navigationType == 'reload') {
        return;
      }
      const fromEntry = this.currentEntry;
      event.intercept({
        handler: () => {
          return this.__effectRoutes(fromEntry, event);
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

  findFirstEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null) {
    const entries = this.entries();
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

  findLastEntry(pattern: Pattern.Pattern<NavigationHistoryEntry>, fromEntry?: NavigationHistoryEntry | null) {
    const entries = this.entries();
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
  private __effectRoutes = async (fromEntry: NavigationHistoryEntry | null, event?: NavigateEvent) => {
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
    const removeAllUnusedEntryNodes = () => {
      for (const node of unuseEntryNodes) {
        node.remove();
      }
    };

    if (!event || event.hasUAVisualTransition) {
      /// 路由改变，重新映射元素
      const routersElements = this.routersElements.filter((ele) => ele instanceof HTMLTemplateElement);
      const allEntries = await navApi.entries();
      for (const navEntry of allEntries) {
        const ele = await this.__effectRoute(navEntry, routersElements, allNavHistoryEntryNodeMap, {
          allEntries,
          currentEntry: fromEntry,
          navigationType: undefined,
        });
        if (ele) {
          unuseEntryNodes.delete(ele);
        }
      }

      // 移除废弃的元素
      removeAllUnusedEntryNodes();
      return;
    }
    /**
     * 手势返回模式
     */
    const swapbackInfo = isSupportTouch
      ? match(event?.info)
          .with({by: 'swapback', start: P.instanceOf(Touch), page: P.instanceOf(AppnPageElement)}, (info) => info satisfies AppnSwapbackInfo)
          .otherwise(() => null)
      : null;

    const effectRoutes = async (lifecycle: SharedElementLifecycle) => {
      // TODO 未来 mode === 'finished' 时，需要通知元素生命周期
      if (lifecycle !== 'finish') {
        const routersElements = this.routersElements.filter((ele) => ele instanceof HTMLTemplateElement);
        const allEntries = await navApi.entries();
        const currentEntry = lifecycle === 'first' ? fromEntry : this.currentEntry;
        for (const navEntry of allEntries) {
          const ele = await this.__effectRoute(navEntry, routersElements, allNavHistoryEntryNodeMap, {
            allEntries,
            currentEntry,
            navigationType: event.navigationType,
          });
          if (ele) {
            unuseEntryNodes.delete(ele);
          }
        }
      } else {
        // 移除废弃的元素
        removeAllUnusedEntryNodes();
      }
    };

    const selector = sharedElement.getSelector('group', '*');
    if (swapbackInfo) {
      sharedElement.setAnimationStyle(selector, {
        animationTimeline: 'linear',
      });
    } else {
      sharedElement.setAnimationStyle(selector, null);
    }

    await sharedElement.startTransition(
      this,
      {
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

            const totalDuration = sharedElement.animationDuration;
            const animations = iter_map_not_null(htmlEle.getAnimations({subtree: true}), (animation) => {
              const sharedAni = sharedElement.isSharedElementAnimation(animation);
              sharedAni?.pause();
              return sharedAni;
            });
            // @ts-ignore
            globalThis.__debug__animationControllers = animations;
            // @ts-ignore
            globalThis.__debug__swapbackInfo = swapbackInfo;
          }
        },
        finish: () => effectRoutes('finish'),
      },
      {
        from: fromEntry,
        /** 不要用 event.destination
         * 在push模式下，它是“空”的（index=-1）
         */
        dest: this.currentEntry, // this.__currentEntry,
        queryNavEntryNode: (navEntry) => this.querySelector(`appn-navigation-history-entry[data-index="${navEntry.index}"]`),
      },
    );
  };

  private __effectRoute = async (
    navEntry: NavigationHistoryEntry,
    routersElements: HTMLTemplateElement[],
    allNavHistoryEntryNodeMap: Map<number, AppnNavigationHistoryEntryElement>,
    context: {
      allEntries: NavigationHistoryEntry[];
      currentEntry: NavigationHistoryEntry | null;
      navigationType?: NavigationTypeString;
    },
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
                (ele) => ele,
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

        const routeMode = match(templateElement.dataset.routeMode)
          .with('dynamic' as const, 'static' as const, (v) => v)
          .otherwise(() => 'static' as const);

        if (oldNavHistoryEntryNode) {
          navHistoryEntryNode = oldNavHistoryEntryNode;
          oldNavHistoryEntryNode.navigationEntry = navEntry;
          if (oldNavHistoryEntryNode.templateEle !== templateElement) {
            oldNavHistoryEntryNode.templateEle = templateElement;
            oldNavHistoryEntryNode.hash = relative_parts.hash;
            if (routeMode === 'static') {
              oldNavHistoryEntryNode.innerHTML = '';
              oldNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
            }
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
          if (routeMode === 'static') {
            newNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
          }
        }

        navHistoryEntryNode.navigationType = context.navigationType ?? null; // 它可能一开始的时候就在 future 里，所以 navigationType 默认为 null
        navHistoryEntryNode.presentEntryIndex = context.currentEntry?.index ?? -1;

        if (!navHistoryEntryNode.parentElement) {
          // 这里await一下，是给自定义元素完成自己的生命周期留时间
          await this.appendChild(navHistoryEntryNode);
        }

        const routeEvent = new AppnRouteActivatedEvent(navEntry, navHistoryEntryNode);
        templateElement.dispatchEvent(routeEvent);
        await routeEvent.__runHandler();

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
    <slot name="router" @slotchange=${() => this.__effectRoutes(this.currentEntry)}></slot>
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
export class AppnNavigationHistoryEntryElement extends LitElement implements CommonSharedAbleContentsElement {
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

  //#region shared-element

  @property({type: String, reflect: true, attribute: true})
  accessor sharedName: string | undefined | null;
  readonly sharedController: StaticSharedController = new StaticSharedController(this);

  #sharedIndex = 0;
  get sharedIndex() {
    return this.#sharedIndex;
  }

  //#endregion

  override render() {
    const {navigationEntry} = this;
    this.dataset.key = navigationEntry?.key;
    /** 自身 index */
    const selfIndex = navigationEntry?.index ?? -1;
    /** 当前 NavigationHistoryEntry 的 index */
    const presentIndex = this.presentEntryIndex;
    this.style.setProperty('--index', (this.dataset.index = `${selfIndex}`));

    /// 配置 sharedElement

    sharedElements.set(this, (this.sharedName = navigationEntry && `--shared-page-${navigationEntry.index}`), {
      group: `z-index:${(this.#sharedIndex = selfIndex * 1000)};`,
    });
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

export class AppnRouteActivatedEvent extends CustomEvent<{
  navEntry: NavigationHistoryEntry;
  navHistoryEntryNode: AppnNavigationHistoryEntryElement;
}> {
  constructor(navEntry: NavigationHistoryEntry, navHistoryEntryNode: AppnNavigationHistoryEntryElement) {
    super('appnrouteactivated', {detail: {navEntry, navHistoryEntryNode}});
  }
  async __runHandler() {
    const handler = this.#handler;
    if (typeof handler === 'function') {
      await handler.call(this);
    }
  }
  #handler?: () => Promise<void>;
  intercept(options?: NavigationInterceptOptions) {
    if (!options) {
      return;
    }
    this.#handler = options.handler;
  }
}

//#region global-type
declare global {
  interface HTMLElementTagNameMap {
    'appn-navigation-provider': AppnNavigationProviderElement;
    'appn-navigation-history-entry': AppnNavigationHistoryEntryElement;
  }
}
//#endregion
