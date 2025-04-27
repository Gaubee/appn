import type {SharedElementConfig, SharedElementLifecycle, SharedElementStyles} from './types';

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
] as const;
class SharedElementRegistry {
  set(element: HTMLElement, sharedName: string, styles: Partial<SharedElementStyles> & {both?: string}): void {
    const {dataset} = element;
    dataset.sharedElement = sharedName;
    for (const styleItem of STYLES) {
      const style = styles[styleItem.key] || (styleItem.alias && styles[styleItem.alias]);
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
      const styles = {} as SharedElementStyles;
      for (const styleItem of STYLES) {
        styles[styleItem.key] = dataset[styleItem.prop] ?? '';
      }
      return {name: sharedName, styles};
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
  queryAll(scope: HTMLElement) {
    return scope.querySelectorAll<HTMLElement>('[data-shared-element]');
  }
  queryAllWithConfig(scope: HTMLElement) {
    const elements = this.queryAll(scope);
    const arr: Array<{element: HTMLElement; config: SharedElementConfig}> = [];
    for (const element of elements) {
      const config = this.get(element)!;
      arr.push({element, config});
    }
    return arr;
  }
}
export const sharedElements = new SharedElementRegistry();
