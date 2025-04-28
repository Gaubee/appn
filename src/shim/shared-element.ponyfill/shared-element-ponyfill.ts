import {iter_first_not_null} from '@gaubee/util';
import {promise_with_resolvers} from '../promise-with-resolvers.polyfill';
import {SharedElementBaseImpl} from '../shared-element.native';
import type {SharedElementAnimation, SharedElementBase, SharedElementLifecycle, SharedElementLifecycleCallbacks, SharedElementSelectorType} from '../shared-element.native/types';
import {SharedElementTransitionPonyfill} from './shared-element-transition';

export class SharedElementPonyfill extends SharedElementBaseImpl implements SharedElementBase {
  override getSelector(type?: SharedElementSelectorType, name?: string) {
    return super.getSelector(type, name).replace(/[:(*)]/g, (c) => `\\${c}`);
  }
  isSharedElementAnimation(animation: Animation): SharedElementAnimation | undefined {
    const {effect} = animation;

    if (effect instanceof KeyframeEffect && effect.target && iter_first_not_null(effect.target.classList, (className) => className.startsWith(this.selectorPrefix))) {
      return animation as Animation & {effect: KeyframeEffect & {target: Element}};
    }
    return;
  }
  async transition(
    scopeElement: HTMLElement,
    callbacks: SharedElementLifecycleCallbacks,
    context: {
      from: NavigationHistoryEntry | null;
      dest: NavigationHistoryEntry | null;
      queryPageNode: (entry: NavigationHistoryEntry, lifecycle: SharedElementLifecycle) => HTMLElement | null;
    }
  ): Promise<void> {
    /// first
    await callbacks?.first?.();

    /// last
    const finishedJob = promise_with_resolvers<void>();
    const readyJob = promise_with_resolvers<void>();
    const updateCallbackDoneJob = promise_with_resolvers<void>();
    const transition = new SharedElementTransitionPonyfill(finishedJob.promise, readyJob.promise, updateCallbackDoneJob.promise, () => {});
    (async () => {
      try {
        await callbacks.last?.();
        updateCallbackDoneJob.resolve();
      } catch (err) {
        updateCallbackDoneJob.reject(err);
      }
    })();

    /// start
    await callbacks?.start?.(transition);

    /// finish
    await transition.finished;
    await callbacks.finish?.(transition);
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

  effectPagesSharedElement(
    _scopeElement: HTMLElement,
    _context: {
      from: NavigationHistoryEntry | null;
      dest: NavigationHistoryEntry | null;
      queryPageNode: (entry: NavigationHistoryEntry, lifecycle: SharedElementLifecycle) => HTMLElement | null;
      lifecycle: SharedElementLifecycle;
    }
  ): void {
    throw new Error('Method not implemented.');
  }
}
