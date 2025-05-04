import {CssSheetArray} from '@gaubee/web';
import {match} from 'ts-pattern';
import {set_intersection} from '../set.polyfill';
import {SharedElementBaseImpl, sharedElementLifecycle, sharedElements} from './shared-element-common';
import {
  type SharedElementAnimation,
  type SharedElementBase,
  type SharedElementConfig,
  type SharedElementLifecycle,
  type SharedElementLifecycleCallbacks,
  type SharedElementTransitionContext,
} from './types';

export class SharedElement extends SharedElementBaseImpl implements SharedElementBase {
  isSharedElementAnimation(animation: Animation): SharedElementAnimation | undefined {
    const {effect} = animation;
    if (effect instanceof KeyframeEffect && effect.pseudoElement?.startsWith(this.selectorPrefix)) {
      return animation as Animation & {effect: KeyframeEffect & {pseudoElement: string}};
    }
    return;
  }

  async startTransition(_scopeElement: HTMLElement, callbacks: SharedElementLifecycleCallbacks, context: SharedElementTransitionContext): Promise<void> {
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
    context: SharedElementTransitionContext,
  ): void {
    if (lifecycle === 'start') {
      // nothing to do
      return;
    }
    const sharedElementPagesContext = this.__getPagesContext(lifecycle, context);
    const {dest, from} = sharedElementPagesContext;
    // 必须确保两个page都存在
    if (dest == null || from == null) return;

    /// 最后，处理过渡元素
    if (lifecycle === 'finish') {
      for (const pageItem of [from, dest]) {
        sharedElementLifecycle.delete(pageItem.navEntryNode);
        /// 清理所有 viewTransitionName
        // pageItem.node.style.viewTransitionName = '';
        for (const sharedElement of sharedElements.queryAll(pageItem.navEntryNode)) {
          sharedElement.style.viewTransitionName = '';
          delete sharedElement.dataset.sharedElementState;
        }
      }
    } else {
      const fromNavEntryNode = from.navEntryNode;
      const destNavEntryNode = dest.navEntryNode;

      const sharedElementCss = this.css;
      const sharedElementMap = new Map<string, HTMLElement>();
      const sharedElementIndex = Math.max(from.navEntryNode.sharedIndex, dest.navEntryNode.sharedIndex) + 1;
      // 必须确保同一个name在两个page都都存在
      const fromSharedElementMap = new Map(sharedElements.queryAllWithConfig(fromNavEntryNode).map((item) => [item.name, item]));
      const destSharedElementMap = new Map(sharedElements.queryAllWithConfig(destNavEntryNode).map((item) => [item.name, item]));
      const sharedElementNames = set_intersection(new Set(fromSharedElementMap.keys()), destSharedElementMap);

      const sharedElementPages = [
        {pageItem: dest, eleMap: destSharedElementMap},
        {pageItem: from, eleMap: fromSharedElementMap},
      ];
      match(lifecycle)
        .with('first', () => sharedElementPages)
        .with('last', () => sharedElementPages.reverse())
        .exhaustive();

      for (const {pageItem, eleMap} of sharedElementPages) {
        sharedElementLifecycle.set(pageItem.navEntryNode, lifecycle);
        const navEntryNode = pageItem.navEntryNode;
        const zIndexStart = navEntryNode.sharedIndex;
        this.__setSharedElement(sharedElementCss, navEntryNode, sharedElements.get(navEntryNode)!, sharedElementMap, `z-index:${zIndexStart};`);
        for (const sharedName of sharedElementNames) {
          const sharedItem = eleMap.get(sharedName)!;
          this.__setSharedElement(sharedElementCss, sharedItem.element, sharedItem, sharedElementMap, `z-index:${sharedElementIndex};`);
        }
      }
    }
  }
  private __setSharedElement(
    sharedElementCss: CssSheetArray,
    element: HTMLElement,
    config: SharedElementConfig,
    sharedElementMap: Map<string, HTMLElement>,
    zIndexCssText: string,
  ) {
    const {name: vtn} = config;
    const oldElement = sharedElementMap.get(vtn);
    if (oldElement) {
      oldElement.style.viewTransitionName = '';
      oldElement.dataset.sharedElementState = 'old';
    }
    sharedElementMap.set(vtn, element);
    element.style.viewTransitionName = vtn;
    element.dataset.sharedElementState = 'new';

    const {group, imagePair, old, new: newStyle} = config.styles;
    const groupStyle = zIndexCssText + group;
    if (groupStyle) {
      sharedElementCss.setRule(`group(${vtn})`, `${this.getSelector('group', vtn)}{${groupStyle}}`);
    }
    if (imagePair) {
      sharedElementCss.setRule(`imagePair(${vtn})`, `${this.getSelector('image-pair', vtn)}{${imagePair}}`);
    }
    if (old) {
      sharedElementCss.setRule(`old(${vtn})`, `${this.getSelector('old', vtn)}{${old}}`);
    }
    if (newStyle) {
      sharedElementCss.setRule(`new(${vtn})`, `${this.getSelector('new', vtn)}{${newStyle}}`);
    }
  }
}
