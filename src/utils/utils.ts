import { func_catch } from '@gaubee/util';
export function format(first?: string, middle?: string, last?: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

interface QueryEffectOptions<ALL extends boolean | void = void> {
  mutationOptions?: MutationObserverInit;
  selectAll?: ALL;
}
type EffectCallback<I> = (arg: I) => void | (() => void);
interface QueryEffect {
  <E extends Element>(root: ParentNode, selector: string, callback: EffectCallback<E | null>, options?: QueryEffectOptions);
  <E extends Element>(root: ParentNode, selector: string, callback: EffectCallback<NodeListOf<E>>, options?: QueryEffectOptions<true>);
}

/**
 * 一个响应式的 querySelector
 * @param root
 * @param selector
 * @param callback
 * @returns
 */
export const queryEffect: QueryEffect = <E extends Element>(root: ParentNode, selector: string, callback: EffectCallback<any>, options: QueryEffectOptions<any> = {}) => {
  let off: void | (() => void) = undefined;
  let effect: () => void;
  if (options.selectAll) {
    let ele: E | null = null;
    effect = () => {
      const newEle = root.querySelector<E>(selector);
      if (newEle != ele) {
        ele = newEle;
        if (typeof off === 'function') {
          func_catch(off)();
        }
        off = callback(ele);
      }
    };
  } else {
    let eles = new Set<E>();
    effect = () => {
      const newEles = new Set<E>();
      const newNodeList = root.querySelectorAll<E>(selector);
      newNodeList.forEach(ele => {
        newEles.add(ele);
      });

      const diffs = newEles.difference(eles);
      if (diffs.size > 0) {
        eles = newEles;
        if (typeof off === 'function') {
          func_catch(off)();
        }
        off = callback(newNodeList);
      }
    };
  }

  let effectTimer: number;
  const mutation = new MutationObserver(() => {
    cancelAnimationFrame(effectTimer);
    effectTimer = requestAnimationFrame(effect);
  });
  mutation.observe(
    root,
    options.mutationOptions ?? {
      subtree: true,
      childList: true,
    },
  );
  effect();

  return () => {
    mutation.disconnect();
    if (typeof off === 'function') {
      func_catch(off)();
    }
  };
};
