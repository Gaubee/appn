import {iter_first_not_null} from '@gaubee/util';
import {AppnSharedElement} from '../../components/appn-shared-contents/appn-shared-contents';
import {abort_throw_if_aborted} from '../abort.polyfill';
import {promise_with_resolvers} from '../promise-with-resolvers.polyfill';
import {set_intersection} from '../set.polyfill';
import {SharedElementBaseImpl, sharedElementLifecycle, sharedElements} from '../shared-element.native';
import type {
  SharedElementAnimation,
  SharedElementBase,
  SharedElementLifecycle,
  SharedElementLifecycleCallbacks,
  SharedElementSelectorType,
  SharedElementTransitionContext,
} from '../shared-element.native/types';
import {SharedElementTransitionPonyfill} from './shared-element-transition';

type SharedElementStyleMap = Map<string, SharedElementStyle>;
type SharedElementStyle = {
  element: AppnSharedElement;
  boudingRect: DOMRect;
};
export class SharedElementPonyfill extends SharedElementBaseImpl implements SharedElementBase {
  override getSelector(type?: SharedElementSelectorType, name?: string) {
    return '.' + super.getSelector(type, name).replace(/[:(*)]/g, (c) => `\\${c}`);
  }
  isSharedElementAnimation(animation: Animation): SharedElementAnimation | undefined {
    const {effect} = animation;

    if (effect instanceof KeyframeEffect && effect.target && iter_first_not_null(effect.target.classList, (className) => className.startsWith(this.selectorPrefix))) {
      return animation as Animation & {effect: KeyframeEffect & {target: Element}};
    }
    return;
  }

  async startTransition(_scopeElement: HTMLElement, callbacks: SharedElementLifecycleCallbacks, context: SharedElementTransitionContext): Promise<void> {
    const firstStyleStore: SharedElementStyleMap = new Map();
    const lastStyleStore: SharedElementStyleMap = new Map();
    new Set(firstStyleStore.keys()).intersection(lastStyleStore);

    /// first
    await callbacks?.first?.();
    this.__captureLifecycleSharedElementsStyle(context, 'first', firstStyleStore);

    /// last
    const finishedJob = promise_with_resolvers<void>();
    const readyJob = promise_with_resolvers<void>();
    const updateCallbackDoneJob = promise_with_resolvers<void>();
    const abort = new AbortController();
    abort.signal.addEventListener('abort', () => {
      const reason = abort.signal.reason;
      updateCallbackDoneJob.reject(reason);
      readyJob.reject(reason);
      finishedJob.reject(reason);
    });

    const transition = new SharedElementTransitionPonyfill(finishedJob.promise, readyJob.promise, updateCallbackDoneJob.promise, () => {
      abort.abort('skip');
    });
    try {
      void (async () => {
        try {
          await callbacks.last?.();
          abort_throw_if_aborted(abort.signal);

          this.__captureLifecycleSharedElementsStyle(context, 'last', lastStyleStore);
          updateCallbackDoneJob.resolve();

          /// 开始构建动画
          const animations = this.__buildSharedElementAnimations(firstStyleStore, lastStyleStore);
          abort.signal.addEventListener('abort', () => {
            animations.forEach((ani) => {
              ani.cancel();
            });
          });
          readyJob.resolve();

          /// 等待动画完成
          Promise.all(animations.map((ani) => ani.finished)).then(() => finishedJob.resolve());
        } catch (err) {
          abort.abort(err);
        }
      })();

      /// start
      await callbacks?.start?.(transition);
      abort_throw_if_aborted(abort.signal);

      /// finish
      await transition.finished;
      abort_throw_if_aborted(abort.signal);
      await callbacks.finish?.(transition);
      abort_throw_if_aborted(abort.signal);
      this.__captureLifecycleSharedElementsStyle(context, 'finish', lastStyleStore);
    } catch (err) {
      abort.abort(err);
    }
  }
  constructor() {
    super();
    const css = String.raw;
    // TODO 使用手动构建 animation 替代，否则会影响样式的计算
    this.css.addRules(css`
      /* appn-navigation-history-entry[data-from-tense='present'] {
        transition-duration: var(--page-leave-duration);
        transition-timing-function: var(--page-leave-ease);
      }
      appn-navigation-history-entry[data-tense='present'] {
        transition-duration: var(--page-enter-duration);
        transition-timing-function: var(--page-enter-ease);
      } */
    `);
  }

  private __captureLifecycleSharedElementsStyle(context: SharedElementTransitionContext, lifecycle: SharedElementLifecycle, store: SharedElementStyleMap = new Map()) {
    const sharedElementPagesContext = this.__getPagesContext('last', context);
    const {dest, from} = sharedElementPagesContext;
    // 必须确保两个page都存在
    if (dest == null || from == null) return store;
    if (lifecycle === 'finish') {
      sharedElementLifecycle.delete(dest.node);
      sharedElementLifecycle.delete(from.node);
      return;
    }
    sharedElementLifecycle.set(dest.node, lifecycle);
    sharedElementLifecycle.set(from.node, lifecycle);

    // 必须确保同一个name在两个page都都存在
    const selector = 'appn-shared-contents';
    const fromSharedElementMap = new Map(sharedElements.queryAllWithConfig<AppnSharedElement>(from.node, selector).map((item) => [item.name, item]));
    const destSharedElementMap = new Map(sharedElements.queryAllWithConfig<AppnSharedElement>(dest.node, selector).map((item) => [item.name, item]));
    const sharedElementNames = set_intersection(new Set(fromSharedElementMap.keys()), destSharedElementMap);
    // 根据生命周期捕捉对应的page元素信息
    const sharedElementMap = lifecycle === 'first' ? fromSharedElementMap : destSharedElementMap;
    for (const sharedName of sharedElementNames) {
      const {element} = sharedElementMap.get(sharedName)!;
      const boudingRect = element.getContentBoundingClientRect();
      if (typeof element.showPopover === 'function') {
        store.set(sharedName, {
          element,
          boudingRect,
        });
      }
    }
    return store;
  }

  private __doAni(item: SharedElementStyle, fromBoudingRect: DOMRect, toBoudingRect: DOMRect) {
    const element = item.element;

    const baseStyle = {
      margin: 0,
      overflow: 'hidden',
      borderWidth: 0,
      outline: '1px solid #0003',
      transformOrigin: 'top left',
      inset: 0,
    };

    const elementAnimation = element.viewTransition(
      [
        {
          ...baseStyle,

          offset: 0,
          top: fromBoudingRect.top + 'px',
          left: fromBoudingRect.left + 'px',

          ...(item.boudingRect === fromBoudingRect
            ? {
                width: fromBoudingRect.width + 'px',
                height: fromBoudingRect.height + 'px',
                scale: '1 1',
                opacity: 1,
              }
            : {
                width: toBoudingRect.width + 'px',
                height: toBoudingRect.height + 'px',
                scale: `${fromBoudingRect.width / toBoudingRect.width} ${fromBoudingRect.height / toBoudingRect.height}`,
                opacity: 0,
              }),
        },
        {
          ...baseStyle,

          offset: 1,
          top: toBoudingRect.top + 'px',
          left: toBoudingRect.left + 'px',

          ...(item.boudingRect === fromBoudingRect
            ? {
                scale: `${toBoudingRect.width / fromBoudingRect.width} ${toBoudingRect.height / fromBoudingRect.height}`,
                opacity: 0,
              }
            : {
                scale: '1 1',
                opacity: 1,
              }),
        },
      ],
      {duration: this.pageAnimationDuration},
    );

    return elementAnimation;
  }

  private __buildSharedElementAnimations(firstStore: SharedElementStyleMap, lastStore: SharedElementStyleMap) {
    const animations: Animation[] = [];
    for (const [sharedName, firstItem] of firstStore) {
      if (!lastStore.has(sharedName)) {
        continue;
      }
      const lastItem = lastStore.get(sharedName)!;
      console.log(sharedName, firstItem, lastItem);

      const oldElementAnimation = this.__doAni(firstItem, firstItem.boudingRect, lastItem.boudingRect);
      const newElementAnimation = this.__doAni(lastItem, firstItem.boudingRect, lastItem.boudingRect);

      animations.push(oldElementAnimation, newElementAnimation);
    }
    return animations;
  }
}
