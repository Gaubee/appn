import type {PromiseMaybe} from '@gaubee/util';
/**
 * 基于 FLIP 思想
 * - first: 准备首帧（First）的样式
 * - last: 准备尾帧（Last）的样式
 * - start: 动画已经开始播放（Invert & Play）
 * - finish: 动画已经播放完成，可以做一些清理工作
 */
export type SharedElementLifecycle = 'first' | 'last' | 'start' | 'finish';

export interface SharedElement {
  transition(callbacks: SharedElementLifecycleCallbacks): Promise<void>;
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
