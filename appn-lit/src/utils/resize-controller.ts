import {
  noChange,
  type ElementPart,
  type ReactiveController,
  type ReactiveControllerHost,
} from 'lit';
import {Directive, directive, PartType, type PartInfo} from 'lit/directive.js';

class ResizeDirective extends Directive {
  private __observedElement?: Element;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    console.log('ResizeDirective created', partInfo);
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
    console.log('ResizeDirective > update()');
    const observedElement = partInfo.element;
    if (this.__observedElement !== observedElement) {
      if (this.__observedElement != null) {
        console.log(
          'ResizeDirective > update() > Unobserving',
          this.__observedElement
        );
        resizeController.__resizeObserver?.unobserve(this.__observedElement);
      }
      console.log(
        'ResizeDirective > update() > Now observing',
        observedElement
      );
      this.__observedElement = observedElement;
      resizeController.__resizeObserver?.observe(observedElement);
    }
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
  __resizeObserver?: ResizeObserver;
  __host;

  __callback;
  constructor(
    host: ReactiveControllerHost,
    callback: (entry: ResizeObserverEntry) => void
  ) {
    (this.__host = host).addController(this); // register for lifecycle updates
    this.__callback = callback;
  }
  hostConnected(): void {
    this.__resizeObserver = new ResizeObserver((entries) => {
      this.__callback(entries[0]);
    });
  }

  hostDisconnected(): void {
    this.__resizeObserver?.disconnect();
    this.__resizeObserver = undefined;
  }

  observe() {
    // Pass a reference to the controller so the directive can
    // notify the controller on size changes.
    return resizeDirective(this);
  }
}
