import {func_remember} from '@gaubee/util';
import {CssSheetArray} from '@gaubee/web';
import {match} from 'ts-pattern';
import {sharedElementLifecycle, sharedElements} from './common';
import {type SharedElement, type SharedElementConfig, type SharedElementLifecycle, type SharedElementLifecycleCallbacks} from './types';

export class SharedElementNative implements SharedElement {
  readonly selectorPrefix = '::view-transition' as const;
  getSelector(type: 'group' | 'old' | 'new', name: string) {
    return `${this.selectorPrefix}-${type}(${name})`;
  }

  /**
   * 这里注入一些全局样式，所以不放在 appnNavigationStyle 里头。
   */
  #css = func_remember(() => {
    const cssArray = new CssSheetArray();
    /**
     * state=old的情况出现在， previousPage 和 subsequentPage 都存在，但是由于 previousPage 页面共同拥有一个 sharedElement。
     * 这就意味着元素是从 previousPage 获取的 old 状态，然后再 subsequentPage 获取的 new 状态。那么原本的 previousPage 页面的元素，在被获取完 old 状态后，就应该隐藏。
     * 否则它在 transition 的时候，会被其它 view-transition 给捕获。
     */
    cssArray.addRule(`[data-shared-element-state='old'] { visibility: hidden !important; }`);

    const setAnimation = (timelineFunction?: string) => {
      cssArray.setRule(
        'timeline-function',
        `::view-transition-group(*){animation-timing-function:${timelineFunction ?? 'cubic-bezier(0.2, 0.9, 0.5, 1)'};animation-duration:350ms}`
      );
    };
    return Object.assign(cssArray, {setAnimation});
  });
  get css() {
    return this.#css();
  }
  async transition(callbacks: SharedElementLifecycleCallbacks) {
    await callbacks?.first?.();
    const transition = document.startViewTransition(callbacks.last);
    await callbacks?.start?.(transition);
    await transition.finished;
    await callbacks.finish?.(transition);
  }

  effectPagesSharedElement = (
    navRoot: Element,
    context: {
      /** 导航的起始页 */
      previousEntry: NavigationHistoryEntry | null;
      /** 导航的目标页 */
      subsequentEntry: NavigationHistoryEntry | null;
      /** 生命周期 */
      lifecycle: SharedElementLifecycle;
    }
  ) => {
    if (context.lifecycle === 'start') {
      // nothing to do
      return;
    }
    type PageItem = {node: HTMLElement; navEntry: NavigationHistoryEntry};
    const sharedElementPagesContext: {
      [key in 'previous' | 'subsequent']?: PageItem;
    } = {};
    /// 获取过渡元素
    const queryPageItem = (navEntry: NavigationHistoryEntry | null): PageItem | undefined => {
      if (navEntry) {
        const node = navRoot.querySelector<HTMLElement>(`appn-navigation-history-entry[data-index="${navEntry.index}"]`);
        if (node) {
          return {node, navEntry};
        }
      }
      return;
    };
    sharedElementPagesContext.previous = queryPageItem(context.previousEntry);
    sharedElementPagesContext.subsequent = queryPageItem(context.subsequentEntry);

    /// 最后，处理过渡元素
    if (context.lifecycle === 'finish') {
      for (const pageItem of [sharedElementPagesContext.previous, sharedElementPagesContext.subsequent]) {
        if (pageItem) {
          sharedElementLifecycle.delete(pageItem.node);
          /// 清理所有 viewTransitionName
          pageItem.node.style.viewTransitionName = '';
          for (const sharedElement of sharedElements.queryAll(pageItem.node)) {
            sharedElement.style.viewTransitionName = '';
            delete sharedElement.dataset.sharedElementState;
          }
        }
      }
    } else {
      const sharedElementCss = this.css;
      const sharedElementMap = new Map<string, HTMLElement>();
      const indexs = [sharedElementPagesContext.previous?.navEntry.index ?? 0, sharedElementPagesContext.subsequent?.navEntry.index ?? 0].sort((a, b) => a - b);
      const [minIndex, maxIndex] = indexs;
      const sharedElementIndex = (maxIndex - minIndex + 1) * 10 + 1;
      const sharedElementPages = match(context.lifecycle)
        .with('first', () => [sharedElementPagesContext.subsequent, sharedElementPagesContext.previous])
        .with('last', () => [sharedElementPagesContext.previous, sharedElementPagesContext.subsequent])
        .exhaustive();

      for (const pageItem of sharedElementPages) {
        if (pageItem) {
          sharedElementLifecycle.set(pageItem.node, context.lifecycle);
          const appnNavVtn = (pageItem.node.style.viewTransitionName = 'appn-' + pageItem.navEntry.index);
          const zIndexStart = (pageItem.navEntry.index - minIndex + 1) * 10;
          sharedElementCss.setRule(`group(${appnNavVtn})`, `${this.getSelector('group', appnNavVtn)}{z-index:${zIndexStart};}`);
          for (const sharedItem of sharedElements.queryAllWithConfig(pageItem.node)) {
            this.__setSharedElement(sharedElementCss, sharedItem.element, sharedItem.config, sharedElementMap, `z-index:${sharedElementIndex};`);
          }
        }
      }
    }
  };
  private __setSharedElement(
    sharedElementCss: CssSheetArray,
    element: HTMLElement,
    config: SharedElementConfig,
    sharedElementMap: Map<string, HTMLElement>,
    zIndexCssText: string
  ) {
    const {name: vtn, styles} = config;
    const oldElement = sharedElementMap.get(vtn);
    if (oldElement) {
      oldElement.style.viewTransitionName = '';
      oldElement.dataset.sharedElementState = 'old';
    }
    sharedElementMap.set(vtn, element);
    element.style.viewTransitionName = vtn;
    element.dataset.sharedElementState = 'new';
    sharedElementCss.setRule(`group(${vtn})`, `${this.getSelector('group', vtn)}{${zIndexCssText}${styles.group ?? ''}}`);
    if (styles.old) {
      sharedElementCss.setRule(`old(${vtn})`, `${this.getSelector('old', vtn)}{${styles.old}}`);
    }
    if (styles.new) {
      sharedElementCss.setRule(`new(${vtn})`, `${this.getSelector('new', vtn)}{${styles.new}}`);
    }
  }
}
export const sharedElementNative = new SharedElementNative();
