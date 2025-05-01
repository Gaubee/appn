import {iter_first_not_null} from '@gaubee/util';
import type {CommonSharedAbleContentsElement} from '../../components/appn-shared-contents/appn-shared-contents-types';
import {abort_throw_if_aborted} from '../abort.polyfill';
import {promise_with_resolvers} from '../promise-with-resolvers.polyfill';
import {set_intersection} from '../set.polyfill';
import {SharedElementBaseImpl, sharedElementLifecycle, sharedElements, type QueryOptions} from '../shared-element.native';
import type {
  SharedElementAnimation,
  SharedElementBase,
  SharedElementLifecycle,
  SharedElementLifecycleCallbacks,
  SharedElementSelectorType,
  SharedElementTransitionContext,
} from '../shared-element.native/types';
import {SharedElementTransitionPonyfill} from './shared-element-transition';

type SharedElementSnapMap = Map<string, SharedElementSnap>;
type SharedElementSnap = {
  element: CommonSharedAbleContentsElement;
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
    const firstSnaps: SharedElementSnapMap = new Map();
    const lastSnaps: SharedElementSnapMap = new Map();
    new Set(firstSnaps.keys()).intersection(lastSnaps);

    /// first
    await callbacks?.first?.();
    this.__captureLifecycleSharedElementsStyle(context, 'first', firstSnaps);

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

          this.__captureLifecycleSharedElementsStyle(context, 'last', lastSnaps);
          updateCallbackDoneJob.resolve();

          /// 开始构建动画
          const animations = this.__buildSharedElementAnimations(firstSnaps, lastSnaps);
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
      this.__captureLifecycleSharedElementsStyle(context, 'finish', lastSnaps);
    } catch (err) {
      abort.abort(err);
    }
  }

  private __captureLifecycleSharedElementsStyle(context: SharedElementTransitionContext, lifecycle: SharedElementLifecycle, snaps: SharedElementSnapMap = new Map()) {
    const sharedElementPagesContext = this.__getPagesContext('last', context);
    const {dest, from} = sharedElementPagesContext;
    // 必须确保两个page都存在
    if (dest == null || from == null) return snaps;
    const fromNavEntryNode = from.navEntryNode;
    const destNavEntryNode = dest.navEntryNode;
    if (lifecycle === 'finish') {
      sharedElementLifecycle.delete(destNavEntryNode);
      sharedElementLifecycle.delete(fromNavEntryNode);
      return;
    }
    sharedElementLifecycle.set(destNavEntryNode, lifecycle);
    sharedElementLifecycle.set(fromNavEntryNode, lifecycle);
    for (const navEntryNode of [fromNavEntryNode, destNavEntryNode]) {
      if (navEntryNode.sharedName) {
        snaps.set(navEntryNode.sharedName, {
          element: navEntryNode,
          ...navEntryNode.getSharedStyle(),
        });
      }
    }

    // 必须确保同一个name在两个page都都存在
    const queryOpts: QueryOptions<CommonSharedAbleContentsElement> = {
      selector: 'appn-shared-contents',
    };
    const fromSharedElementMap = new Map(sharedElements.queryAllWithConfig(fromNavEntryNode, queryOpts).map((item) => [item.name, item]));
    const destSharedElementMap = new Map(sharedElements.queryAllWithConfig(destNavEntryNode, queryOpts).map((item) => [item.name, item]));
    const sharedElementNames = set_intersection(new Set(fromSharedElementMap.keys()), destSharedElementMap);
    // 根据生命周期捕捉对应的page元素信息
    const sharedElementMap = lifecycle === 'first' ? fromSharedElementMap : destSharedElementMap;
    for (const sharedName of sharedElementNames) {
      const {element} = sharedElementMap.get(sharedName)!;
      const style = element.getSharedStyle();
      snaps.set(sharedName, {
        element,
        ...style,
      });
    }
    return snaps;
  }

  private __doAni(mode: 'new' | 'old' | 'shared', item: SharedElementSnap, fromBoudingRect: DOMRect, toBoudingRect: DOMRect) {
    const element = item.element;

    const baseStyle = {
      margin: 0,
      overflow: 'hidden',
      borderWidth: 0,
      outline: '1px solid #0003',
      transformOrigin: 'top left',
      inset: 0,
      top: 0,
      left: 0,
      // mixBlendMode: 'plus-lighter',
    };
    const keyframes: Keyframe[] = [
      {
        ...baseStyle,

        translate: `${fromBoudingRect.left}px ${fromBoudingRect.top}px`,
        offset: 0,

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
              opacity: mode === 'shared' ? 1 : 0,
            }),
      },
      {
        ...baseStyle,

        offset: 1,
        translate: `${toBoudingRect.left}px ${toBoudingRect.top}px`,

        ...(item.boudingRect === fromBoudingRect
          ? {
              scale: `${toBoudingRect.width / fromBoudingRect.width} ${toBoudingRect.height / fromBoudingRect.height}`,
              opacity: mode === 'shared' ? 1 : 0,
            }
          : {
              scale: '1 1',
              opacity: 1,
            }),
      },
    ];
    console.log('QAQ keyframes', keyframes);

    const elementAnimation = element.createSharedAnimation(keyframes, {
      duration: this.animationDuration,
      easing: this.animationEasing,
    });

    return elementAnimation;
  }

  private __buildSharedElementAnimations(firstSnaps: SharedElementSnapMap, lastSnaps: SharedElementSnapMap) {
    const animations: Animation[] = [];
    for (const [sharedName, firstSnap] of firstSnaps) {
      if (!lastSnaps.has(sharedName)) {
        continue;
      }
      const lastSnap = lastSnaps.get(sharedName)!;
      console.log(sharedName, firstSnap.element === lastSnap.element, firstSnap, lastSnap);
      if (firstSnap.element === lastSnap.element) {
        const sharedElementAnimation = this.__doAni('shared', firstSnap, firstSnap.boudingRect, lastSnap.boudingRect);
        animations.push(sharedElementAnimation);
      } else {
        const oldElementAnimation = this.__doAni('old', firstSnap, firstSnap.boudingRect, lastSnap.boudingRect);
        const newElementAnimation = this.__doAni('new', lastSnap, firstSnap.boudingRect, lastSnap.boudingRect);
        animations.push(oldElementAnimation, newElementAnimation);
      }
    }
    return animations;
  }
}
