import {noChange, type ElementPart, type ReactiveController, type ReactiveControllerHost} from 'lit';
import {Directive, directive, PartType, type PartInfo} from 'lit/directive.js';

class MutationDirective extends Directive {
  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `mutationDirective` directive must be used on property of Element or SVGElement.');
    }
  }

  override update(partInfo: ElementPart, [mutationController]: [MutationController]) {
    mutationController.bindElement(partInfo.element);

    return noChange;
  }
  override render(_: MutationController) {
    return '';
  }
}

const mutationDirective = directive(MutationDirective);

/**
 * Observer Element Mutation Reactive Controller
 *
 * <i18n lang="zh-cn">
 * 监测元素尺寸变动的 响应式控制器
 * </i18n>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Mutation_Observer_API}
 */
export class MutationController implements ReactiveController {
  private __mutationObserver: MutationObserver;
  private __options;
  private __host;

  private __callback;
  constructor(host: ReactiveControllerHost, callback: MutationCallback, options?: MutationObserverInit) {
    this.__host = host;
    this.__host.addController(this); // register for lifecycle updates
    this.__callback = callback;
    this.__options = options;
    this.__mutationObserver = new MutationObserver(this.__callback);
  }
  hostConnected(): void {
    if (this.__bindingElement) {
      this.bindElement(this.__bindingElement);
    }
  }

  hostDisconnected(): void {
    this.__mutationObserver.disconnect();
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
    if (this.__bindingElement !== ele) {
      if (this.__bindingElement != null) {
        this.__mutationObserver.disconnect();
      }
      this.__bindingElement = ele;
      this.__mutationObserver.observe(ele, this.__options);
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
        this.__mutationObserver.disconnect();
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
    return mutationDirective(this);
  }
}
