import {html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {sharedElements} from '../../shim/shared-element.native';
import {ResizeController} from '../../utils/resize-controller';
import {appnSharedStyle} from './appn-shared-contents.css';

@customElement('appn-shared-contents')
export class AppnSharedElement extends LitElement {
  static override styles = appnSharedStyle;

  @property({type: String, reflect: true, attribute: true})
  accessor name!: string;

  @property({type: String, reflect: true, attribute: true})
  accessor oldStyle!: string;
  @property({type: String, reflect: true, attribute: true})
  accessor newStyle!: string;

  private __width = 0;
  private __height = 0;

  private __dialog = new ResizeController(this, (entry) => {
    this.__width = entry.contentRect.width;
    this.__height = entry.contentRect.height;
    this.requestUpdate();
  });

  @query('dialog', true)
  private accessor __dialogEle!: HTMLDialogElement;
  startViewTransition() {
    this.__dialogEle.open = false;
    this.__dialogEle.showModal();
  }
  stopViewTranstion() {
    this.__dialogEle.close();
    this.__dialogEle.open = true;
  }

  viewTransition(...args: Parameters<HTMLElement['animate']>) {
    this.startViewTransition();
    const ani = this.__dialogEle.animate(...args);
    ani.finished.finally(() => this.stopViewTranstion());
    return ani;
  }
  getContentBoundingClientRect() {
    return this.__dialogEle.getBoundingClientRect();
  }

  override render() {
    sharedElements.set(this, this.name, {
      old: this.oldStyle,
      new: this.newStyle,
    });

    return html`<style>
        :host {
          width: ${this.__width}px;
          height: ${this.__height}px;
        }
      </style>
      <dialog open ${this.__dialog.observe()}><slot></slot></dialog>`;
  }
}
