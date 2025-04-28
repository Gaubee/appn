import {iter_first_not_null} from '@gaubee/util';
import {promise_with_resolvers} from '../promise-with-resolvers.polyfill';
import {SharedElementBaseImpl, sharedElements} from '../shared-element.native';
import type {
  SharedElementAnimation,
  SharedElementBase,
  SharedElementLifecycleCallbacks,
  SharedElementSelectorType,
  SharedElementTransitionContext,
} from '../shared-element.native/types';
import {SharedElementTransitionPonyfill} from './shared-element-transition';

type SharedElementStyleMap = Map<string, {boudingRect: DOMRect}>;
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

  async transition(_scopeElement: HTMLElement, callbacks: SharedElementLifecycleCallbacks, context: SharedElementTransitionContext): Promise<void> {
    const firstStyle: SharedElementStyleMap = new Map();
    const lastStyle: SharedElementStyleMap = new Map();

    /// first
    await callbacks?.first?.();
    {
      const sharedElementPagesContext = this.__getPagesContext('first', context);
      for (const key of ['from', 'dest'] as const) {
        const ele = sharedElementPagesContext[key]?.node;
        if (ele) {
          this.__captureSharedElementsStyle(ele, firstStyle);
        }
      }
    }

    /// last
    const finishedJob = promise_with_resolvers<void>();
    const readyJob = promise_with_resolvers<void>();
    const updateCallbackDoneJob = promise_with_resolvers<void>();
    const abort = (reason: unknown) => {
      updateCallbackDoneJob.reject(reason);
      readyJob.reject(reason);
      finishedJob.reject(reason);
    };
    const transition = new SharedElementTransitionPonyfill(finishedJob.promise, readyJob.promise, updateCallbackDoneJob.promise, () => {});
    try {
      void (async () => {
        try {
          await callbacks.last?.();
          {
            const sharedElementPagesContext = this.__getPagesContext('last', context);
            for (const key of ['dest', 'from'] as const) {
              const ele = sharedElementPagesContext[key]?.node;
              if (ele) {
                this.__captureSharedElementsStyle(ele, lastStyle);
              }
            }
          }
          updateCallbackDoneJob.resolve();

          /// 开始构建动画
          const animations: Animation[] = [];

          readyJob.resolve();

          /// 等待动画完成
          Promise.all(animations.map((ani) => ani.finished)).then(() => finishedJob.resolve());
        } catch (err) {
          abort(err);
        }
      })();

      /// start
      await callbacks?.start?.(transition);

      /// finish
      await transition.finished;
      await callbacks.finish?.(transition);
    } catch (err) {
      abort(err);
    }
  }
  constructor() {
    super();
    const css = String.raw;
    this.css.addRules(css`
      appn-navigation-history-entry[data-from-tense='present'] {
        transition-duration: var(--page-leave-duration);
        transition-timing-function: var(--page-leave-ease);
      }
      appn-navigation-history-entry[data-tense='present'] {
        transition-duration: var(--page-enter-duration);
        transition-timing-function: var(--page-enter-ease);
      }
    `);
  }

  private __captureSharedElementsStyle(scopeElement: HTMLElement, store: SharedElementStyleMap) {
    for (const {element, config} of sharedElements.queryAllWithConfig(scopeElement)) {
      const boudingRect = element.getBoundingClientRect();
      store.set(config.name, {
        boudingRect,
      });
    }
  }
}
