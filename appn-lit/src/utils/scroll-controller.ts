import {
  noChange,
  type ElementPart,
  type ReactiveController,
  type ReactiveControllerHost,
} from 'lit';
import {Directive, type PartInfo, PartType, directive} from 'lit/directive.js';
import {
  addScrollendEventListener,
  removeScrollendEventListener,
} from '../ponyfill/scrollend';

class ScrollDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo);
    console.debug('ScrollDirective created', partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        'The `scrollDirective` directive must be used on property of Element or SVGElement.'
      );
    }
  }

  override update(
    partInfo: ElementPart,
    [scrollController]: [ScrollController]
  ) {
    scrollController.bindElement(partInfo.element);

    return noChange;
  }
  override render(_: ScrollController) {
    return '';
  }
}

const scrollDirective = directive(ScrollDirective);
/**
 * Listen Element ScrollEvent/ScrollEndEvent Reactive Controller
 *
 * <i18n lang="zh-cn">
 * 监听元素 ScrollEvent/ScrollEndEvent 事件的 响应式控制器
 * </i18n>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event}
 */
export class ScrollController implements ReactiveController {
  private __scrollObserver: ScrollObserver;
  private __host;
  private __callback;
  private __options;
  constructor(
    host: ReactiveControllerHost,
    callback: (event: AnyScrollEvent) => void,
    options?: ResizeObserverOptions
  ) {
    this.__host = host;
    this.__host.addController(this); // register for lifecycle updates
    this.__callback = callback;
    this.__options = options;
    this.__scrollObserver = new ScrollObserver(this.__callback);
  }

  hostConnected(): void {
    if (this.__bindingElement) {
      this.bindElement(this.__bindingElement);
    }
  }

  hostDisconnected(): void {
    this.__scrollObserver.disconnect();
  }
  private __bindingElement?: Element;
  /**
   * 当前绑定的元素
   */
  get bindingElement() {
    return this.__bindingElement;
  }
  /**
   * 解除绑定
   * @returns this，方便进行链式调用
   */
  bindElement(ele: Element) {
    console.debug('ScrollController > bindElement');
    if (this.__bindingElement !== ele) {
      if (this.__bindingElement != null) {
        console.debug(
          'ScrollController > bindElement > Unobserving',
          this.__bindingElement
        );
        this.__scrollObserver.unobserve(this.__bindingElement);
      }
      console.debug('ScrollController > bindElement > Now observing', ele);
      this.__bindingElement = ele;
      this.__scrollObserver.observe(ele, this.__options);
    }
    return this;
  }
  /**
   * 解除元素绑定
   * @param ele 所要解绑的元素
   * @returns 当前 bindingElement == null
   */
  unbindElement(ele = this.__bindingElement) {
    if (this.__bindingElement === ele && this.__bindingElement) {
      if (this.__bindingElement != null) {
        console.debug(
          'ScrollController > unbindElement',
          this.__bindingElement
        );
        this.__scrollObserver.unobserve(this.__bindingElement);
        this.__bindingElement = undefined;
      }
    }
    return this.__bindingElement == null;
  }
  /**
   * 响应式绑定
   * @returns 用于挂载在 htmlTemplate-attribute 中的指令
   */
  observe() {
    // Pass a reference to the controller so the directive can
    // notify the controller on size changes.
    return scrollDirective(this);
  }
}

class ScrollObserver {
  private __callback;
  constructor(callback: (event: AnyScrollEvent) => void) {
    this.__callback = callback;
  }
  private __onscroll = (event: Event) => {
    this.__callback(event as AnyScrollEvent);
  };
  private __onscrollend = (event: Event) => {
    this.__callback(event as AnyScrollEvent);
  };
  private __eles = new Map<Element, ScrollObserverOptions>();
  observe(ele: Element, opts: ScrollObserverOptions = {}) {
    if (this.__eles.has(ele)) {
      return;
    }
    this.__eles.set(ele, opts);
    ele.addEventListener('scroll', this.__onscroll);
    addScrollendEventListener(ele, this.__onscrollend);
  }
  unobserve(ele: Element) {
    if (!this.__eles.has(ele)) {
      return;
    }
    this.__eles.delete(ele);
    ele.removeEventListener('scroll', this.__onscroll);
    removeScrollendEventListener(ele, this.__onscrollend);
  }
  disconnect() {
    for (const ele of [...this.__eles.keys()]) {
      this.unobserve(ele);
    }
  }
}
interface ScrollObserverOptions {}

export interface ScrollEvent extends Event {
  type: 'scroll';
  target: HTMLElement;
}
export interface ScrollEndEvent extends Event {
  type: 'scrollend';
  target: HTMLElement;
}
export type AnyScrollEvent = ScrollEvent | ScrollEndEvent;
