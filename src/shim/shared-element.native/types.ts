import type {PromiseMaybe} from '@gaubee/util';
import type {CssSheetArray} from '@gaubee/web';
import type {Properties} from 'csstype';
import type {AppnNavigationHistoryEntryElement} from '../../components/appn-navigation/appn-navigation';

export const caniuseSharedElement = /*@__PURE__*/ CSS.supports('view-transition-name: none'); // 'startViewTransition' in document;

/**
 * 基于 FLIP 思想
 * - first: 准备首帧（First）的样式
 * - last: 准备尾帧（Last）的样式
 * - start: 动画已经开始播放（Invert & Play）
 * - finish: 动画已经播放完成，可以做一些清理工作
 */
export type SharedElementLifecycle = 'first' | 'last' | 'start' | 'finish';

export type AnimationProperties = Pick<
  Properties,
  NonNullable<
    {
      [P in keyof Properties]: P extends `animation${string}` ? P : never;
    }[keyof Properties]
  >
>;

export type SharedElementSelectorType = 'group' | 'image-pair' | 'old' | 'new';
export interface SharedElementAnimation extends Animation {
  effect: KeyframeEffect; //& {pseudoElement: string};
}

export interface SharedElementBase {
  isSharedElementAnimation(animation: Animation): SharedElementAnimation | undefined;
  /**
   * get selector by shared-element name, "*" is an literal
   * @param type - default is 'group'
   * @param name - default is '*'
   */
  getSelector(type: SharedElementSelectorType, name: string): string;
  /**
   * default or delete animation style
   * @param style - animation style
   * @param selector - default is getSelector('group','*)
   */
  setAnimationStyle(selector: string, style: AnimationProperties | null): void;
  readonly animationDuration: number;

  readonly css: CssSheetArray;
  /**
   * play transition animation
   * @param callbacks
   */
  startTransition(scopeElement: HTMLElement, callbacks: SharedElementLifecycleCallbacks, context: SharedElementTransitionContext): Promise<void>;

  // /**
  //  * the effect of shared-element 'navigate' event fired.
  //  * @param rootNode
  //  * @param context
  //  */
  // effectPagesSharedElement(
  //   scopeElement: HTMLElement,
  //   context: {
  //     from: NavigationHistoryEntry | null;
  //     dest: NavigationHistoryEntry | null;
  //     queryPageNode: (entry: NavigationHistoryEntry) => HTMLElement | null;
  //     lifecycle: SharedElementLifecycle;
  //   }
  // ): void;
}
export interface SharedElementTransitionContext {
  /** 导航的起始页 */
  from: NavigationHistoryEntry | null;
  /** 导航的目标页 */
  dest: NavigationHistoryEntry | null;
  /** 根据导航对象返回页面节点 */
  queryNavEntryNode: (entry: NavigationHistoryEntry, lifecycle: SharedElementLifecycle) => AppnNavigationHistoryEntryElement | null;
}

export interface SharedElementLifecycleCallbacks {
  first?: () => PromiseMaybe<void>;
  last?: () => PromiseMaybe<void>;
  start?: (transiton: SharedElementTransition) => PromiseMaybe<void>;
  finish?: (transiton: SharedElementTransition) => PromiseMaybe<void>;
}

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition) */
export interface SharedElementTransition {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/finished) */
  readonly finished: Promise<void>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/ready) */
  readonly ready: Promise<void>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/updateCallbackDone) */
  readonly updateCallbackDone: Promise<void>;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ViewTransition/skipTransition) */
  skipTransition(): void;
}

export interface SharedElementStyles {
  group: string;
  imagePair: string;
  old: string;
  new: string;
}
export interface SharedElementConfig {
  name: string;
  styles: SharedElementStyles;
}
