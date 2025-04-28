//@ts-nocheck
import type {AnimationProperties, SharedElementBase, SharedElementLifecycle, SharedElementLifecycleCallbacks, SharedElementSelectorType} from '../shared-element.native/types';

export class SharedElementPonyfill implements SharedElementBase {
  selectorPrefix: string;
  getSelector(type: SharedElementSelectorType, name: string): string {
    throw new Error('Method not implemented.');
  }
  setAnimationStyle(selector: string, style: AnimationProperties | null): void {
    throw new Error('Method not implemented.');
  }
  transition(callbacks: SharedElementLifecycleCallbacks): Promise<void> {
    throw new Error('Method not implemented.');
  }
  effectPagesSharedElement(
    scopeElement: HTMLElement,
    context: {
      from: NavigationHistoryEntry | null;
      dest: NavigationHistoryEntry | null;
      queryPageNode: (entry: NavigationHistoryEntry) => HTMLElement | null;
      lifecycle: SharedElementLifecycle;
    }
  ): void {
    throw new Error('Method not implemented.');
  }
}
export const sharedElementPonyfill = new SharedElementPonyfill();
