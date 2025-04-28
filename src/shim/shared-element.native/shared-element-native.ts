import {CssSheetArray} from '@gaubee/web';
import {match} from 'ts-pattern';
import {SharedElementBaseImpl, sharedElementLifecycle, sharedElements} from './common';
import {type SharedElementAnimation, type SharedElementBase, type SharedElementConfig, type SharedElementLifecycle, type SharedElementLifecycleCallbacks} from './types';

export class SharedElement extends SharedElementBaseImpl implements SharedElementBase {
  isSharedElementAnimation(animation: Animation): SharedElementAnimation | undefined {
    const {effect} = animation;
    if (effect instanceof KeyframeEffect && effect.pseudoElement?.startsWith(this.selectorPrefix)) {
      return animation as Animation & {effect: KeyframeEffect & {pseudoElement: string}};
    }
    return;
  }

  async transition(
    _scopeElement: HTMLElement,
    callbacks: SharedElementLifecycleCallbacks,
    context: {
      from: NavigationHistoryEntry | null;
      dest: NavigationHistoryEntry | null;
      queryPageNode: (entry: NavigationHistoryEntry, lifecycle: SharedElementLifecycle) => HTMLElement | null;
    }
  ): Promise<void> {
    try {
      await callbacks?.first?.();
      this.__effectPagesSharedElement('first', context);
      const transition = document.startViewTransition(async () => {
        await callbacks.last?.();
        this.__effectPagesSharedElement('last', context);
      });
      await callbacks?.start?.(transition);
      await transition.finished;
      await callbacks.finish?.(transition);
    } finally {
      this.__effectPagesSharedElement('finish', context);
    }
  }

  private __effectPagesSharedElement(
    /** 生命周期 */
    lifecycle: SharedElementLifecycle,
    context: {
      /** 导航的起始页 */
      from: NavigationHistoryEntry | null;
      /** 导航的目标页 */
      dest: NavigationHistoryEntry | null;
      /** 根据导航对象返回页面节点 */
      queryPageNode: (entry: NavigationHistoryEntry, lifecycle: SharedElementLifecycle) => HTMLElement | null;
    }
  ): void {
    if (lifecycle === 'start') {
      // nothing to do
      return;
    }
    type PageItem = {node: HTMLElement; navEntry: NavigationHistoryEntry};
    const sharedElementPagesContext: {
      [key in 'from' | 'dest']?: PageItem;
    } = {};
    /// 获取过渡元素
    const queryPageItem = (navEntry: NavigationHistoryEntry | null): PageItem | undefined => {
      if (navEntry) {
        const node = context.queryPageNode(navEntry, lifecycle);
        if (node) {
          return {node, navEntry};
        }
      }
      return;
    };
    sharedElementPagesContext.from = queryPageItem(context.from);
    sharedElementPagesContext.dest = queryPageItem(context.dest);

    /// 最后，处理过渡元素
    if (lifecycle === 'finish') {
      for (const pageItem of [sharedElementPagesContext.from, sharedElementPagesContext.dest]) {
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
      const indexs = [sharedElementPagesContext.from?.navEntry.index ?? 0, sharedElementPagesContext.dest?.navEntry.index ?? 0].sort((a, b) => a - b);
      const [minIndex, maxIndex] = indexs;
      const sharedElementIndex = (maxIndex - minIndex + 1) * 10 + 1;
      const sharedElementPages = match(lifecycle)
        .with('first', () => [sharedElementPagesContext.dest, sharedElementPagesContext.from])
        .with('last', () => [sharedElementPagesContext.from, sharedElementPagesContext.dest])
        .exhaustive();

      for (const pageItem of sharedElementPages) {
        if (pageItem) {
          sharedElementLifecycle.set(pageItem.node, lifecycle);
          const appnNavVtn = (pageItem.node.style.viewTransitionName = '--shared-page-' + pageItem.navEntry.index);
          const zIndexStart = (pageItem.navEntry.index - minIndex + 1) * 10;
          sharedElementCss.setRule(`group(${appnNavVtn})`, `${this.getSelector('group', appnNavVtn)}{z-index:${zIndexStart};}`);
          for (const sharedItem of sharedElements.queryAllWithConfig(pageItem.node)) {
            this.__setSharedElement(sharedElementCss, sharedItem.element, sharedItem.config, sharedElementMap, `z-index:${sharedElementIndex};`);
          }
        }
      }
    }
  }
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
    if (styles.imagePair) {
      sharedElementCss.setRule(`imagePair(${vtn})`, `${this.getSelector('image-pair', vtn)}{${styles.imagePair}}`);
    }
    if (styles.old) {
      sharedElementCss.setRule(`old(${vtn})`, `${this.getSelector('old', vtn)}{${styles.old}}`);
    }
    if (styles.new) {
      sharedElementCss.setRule(`new(${vtn})`, `${this.getSelector('new', vtn)}{${styles.new}}`);
    }
  }
}
