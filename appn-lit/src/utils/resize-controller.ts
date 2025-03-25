import {
  noChange,
  type ElementPart,
  type ReactiveController,
  type ReactiveControllerHost,
} from 'lit';
import {Directive, directive, PartType, type PartInfo} from 'lit/directive.js';

class ResizeDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo);
    console.debug('ResizeDirective created', partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error(
        'The `resizeDirective` directive must be used on property of Element or SVGElement.'
      );
    }
  }

  override update(
    partInfo: ElementPart,
    [resizeController]: [ResizeController]
  ) {
    resizeController.bindElement(partInfo.element);

    return noChange;
  }
  override render(_: ResizeController) {
    return '';
  }
}

const resizeDirective = directive(ResizeDirective);

export interface ResizeSize {
  blockSize: number;
  inlineSize: number;
}
export class ResizeController implements ReactiveController {
  __resizeObserver: ResizeObserver;
  __options;
  __host;

  __callback;
  constructor(
    host: ReactiveControllerHost,
    callback: (entry: ResizeObserverEntry) => void,
    options?: ResizeObserverOptions
  ) {
    (this.__host = host).addController(this); // register for lifecycle updates
    this.__callback = callback;
    this.__options = options;
    this.__resizeObserver = new ResizeObserver((entries) => {
      this.__callback(entries[0]);
    });
  }
  hostConnected(): void {
    if (this.__bindingElement) {
      this.bindElement(this.__bindingElement);
    }
  }

  hostDisconnected(): void {
    this.__resizeObserver.disconnect();
  }
  private __bindingElement?: Element;
  bindElement(ele: Element) {
    console.debug('ResizeController > bindElement');
    if (this.__bindingElement !== ele) {
      if (this.__bindingElement != null) {
        console.debug(
          'ResizeController > bindElement > Unobserving',
          this.__bindingElement
        );
        this.__resizeObserver.unobserve(this.__bindingElement);
      }
      console.debug('ResizeController > bindElement > Now observing', ele);
      this.__bindingElement = ele;
      this.__resizeObserver.observe(ele, this.__options);
    }
    return this;
  }

  observe() {
    // Pass a reference to the controller so the directive can
    // notify the controller on size changes.
    return resizeDirective(this);
  }
}
