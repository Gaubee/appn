import {func_remember, obj_lazy_builder} from '@gaubee/util';
import {CssSheetArray} from '@gaubee/web';
import type {AppnNavigationHistoryEntryElement} from '../../components/appn-navigation/appn-navigation';
import {styleToCss} from '../../utils/css-helper';
import type {
  AnimationProperties,
  SharedElementAnimation,
  SharedElementBase,
  SharedElementConfig,
  SharedElementLifecycle,
  SharedElementLifecycleCallbacks,
  SharedElementSelectorType,
  SharedElementStyles,
  SharedElementTransitionContext,
} from './types';

export const sharedElementLifecycle = {
  set(element: HTMLElement, value: SharedElementLifecycle) {
    element.dataset.sharedElementLifecycle = value;
  },
  get(element: HTMLElement) {
    return element.dataset.sharedElementLifecycle as SharedElementLifecycle | undefined;
  },
  delete(element: HTMLElement) {
    delete element.dataset.sharedElementLifecycle;
  },
};

const STYLES = [
  {key: 'group', alias: null, prop: 'sharedElementGroupStyle'},
  {key: 'new', alias: 'both', prop: 'sharedElementNewStyle'},
  {key: 'old', alias: 'both', prop: 'sharedElementOldStyle'},
  {key: 'imagePair', alias: null, prop: 'sharedElementImagePairStyle'},
] as const;
const styles_key_prop = new Map(STYLES.map((style) => [style.key, style.prop]));
class SharedElementRegistry {
  set(element: HTMLElement, sharedName: string | null = null, styles?: Partial<SharedElementStyles> & {both?: string}): void {
    if (sharedName == null) {
      return this.unset(element);
    }
    const {dataset} = element;
    dataset.sharedElement = sharedName;
    for (const styleItem of STYLES) {
      const style = styles ? styles[styleItem.key] || (styleItem.alias && styles[styleItem.alias]) : null;
      if (style) {
        dataset[styleItem.prop] = style;
      } else {
        delete dataset[styleItem.prop];
      }
    }
  }
  get(element: HTMLElement): SharedElementConfig | undefined {
    const {dataset} = element;
    const sharedName = dataset.sharedElement;
    if (sharedName) {
      let styles: SharedElementStyles | undefined;

      return {
        name: sharedName,
        get styles() {
          return (styles ??= obj_lazy_builder<SharedElementStyles>({}, (_target, key) => {
            const prop = styles_key_prop.get(key);
            return prop ? (dataset[prop] ?? '') : '';
          }));
        },
      };
    }
    return;
  }
  unset(element: HTMLElement): void {
    const {dataset} = element;
    if (dataset.sharedElement) {
      delete dataset.sharedElement;
      for (const styleItem of STYLES) {
        delete dataset[styleItem.prop];
      }
    }
  }
  queryAll<T extends HTMLElement = HTMLElement>(scope: HTMLElement, options?: QueryOptions<T>) {
    let eles = [].slice.call(scope.querySelectorAll<T>(options?.selector ?? '[data-shared-element]')) as T[];
    if (options?.filter) {
      eles = eles.filter(options.filter);
    }
    return eles;
  }
  queryAllWithConfig<T extends HTMLElement = HTMLElement>(scope: HTMLElement, options?: QueryOptions<T>) {
    const elements = this.queryAll<T>(scope, options);
    const arr: Array<SharedElementConfig & {element: T}> = [];
    for (const element of elements) {
      const config = this.get(element)!;
      arr.push(Object.assign(config, {element}));
    }
    return arr;
  }
}
export type QueryOptions<T extends HTMLElement = HTMLElement> = {
  selector?: string;
  filter?: (ele: T) => boolean;
};
export const sharedElements = new SharedElementRegistry();

export abstract class SharedElementBaseImpl implements SharedElementBase {
  readonly selectorPrefix = '::view-transition' as const;
  abstract isSharedElementAnimation(animation: Animation): SharedElementAnimation | undefined;

  getSelector(type: SharedElementSelectorType = 'group', name: string = '*') {
    return `${this.selectorPrefix}-${type}(${name})`;
  }
  setAnimationStyle(selector: string = this.getSelector(), style: AnimationProperties | null = null) {
    const key = `--user-${selector}`;
    if (style == null) {
      this.css.deleteRule(key);
    } else {
      this.css.setRule(key, `${selector}{${styleToCss(style)}}`);
    }
  }
  readonly animationDuration: number = 350;
  readonly animationEasing: string = 'cubic-bezier(0.2, 0.9, 0.5, 1)';

  /**
   * 这里注入一些全局样式，所以不放在 appnNavigationStyle 里头。
   */
  #css = func_remember(() => {
    const css = String.raw;
    const cssArray = new CssSheetArray();
    /**
     * state=old的情况出现在， previousPage 和 subsequentPage 都存在，但是由于 previousPage 页面共同拥有一个 sharedElement。
     * 这就意味着元素是从 previousPage 获取的 old 状态，然后再 subsequentPage 获取的 new 状态。那么原本的 previousPage 页面的元素，在被获取完 old 状态后，就应该隐藏。
     * 否则它在 transition 的时候，会被其它 view-transition 给捕获。
     */
    cssArray.addRule(css`
      [data-shared-element-state='old'] {
        visibility: hidden !important;
      }
    `);

    cssArray.addRule(css`
      ${this.getSelector('group', '*')} {
        animation-timing-function: ${this.animationEasing};
        animation-duration: ${this.animationDuration}ms;
      }
    `);

    return cssArray;
  });
  get css() {
    return this.#css();
  }

  abstract startTransition(scopeElement: HTMLElement, callbacks: SharedElementLifecycleCallbacks, context: SharedElementTransitionContext): Promise<void>;

  protected __getPagesContext(lifecycle: SharedElementLifecycle, context: SharedElementTransitionContext) {
    type PageItem = {navEntryNode: AppnNavigationHistoryEntryElement; navEntry: NavigationHistoryEntry};
    const sharedElementPagesContext: {
      [key in 'from' | 'dest']?: PageItem;
    } = {};
    /// 获取过渡元素
    const queryPageItem = (navEntry: NavigationHistoryEntry | null): PageItem | undefined => {
      if (navEntry) {
        const navEntryNode = context.queryNavEntryNode(navEntry, lifecycle);
        if (navEntryNode) {
          return {navEntryNode, navEntry};
        }
      }
      return;
    };
    sharedElementPagesContext.from = queryPageItem(context.from);
    sharedElementPagesContext.dest = queryPageItem(context.dest);
    return sharedElementPagesContext;
  }
}
