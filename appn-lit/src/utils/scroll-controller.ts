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
export class ScrollController implements ReactiveController {
  __scrollObserver: ScrollObserver;
  __host;
  __callback;
  __options;
  constructor(
    host: ReactiveControllerHost,
    callback: (event: AnyScrollEvent) => void,
    options?: ResizeObserverOptions
  ) {
    (this.__host = host).addController(this); // register for lifecycle updates
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
  }
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

interface ScrollEvent extends Event {
  type: 'scroll';
  target: HTMLElement;
}
interface ScrollEndEvent extends Event {
  type: 'scrollend';
  target: HTMLElement;
}
type AnyScrollEvent = ScrollEvent | ScrollEndEvent;
