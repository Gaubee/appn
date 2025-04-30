import {html, LitElement} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {sharedElements} from '../../shim/shared-element.native';
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

  @state()
  private accessor __startSize: DOMRect | null = null;

  @query('dialog', true)
  private accessor __dialogEle!: HTMLDialogElement;
  startViewTransition() {
    if (this.__startSize) {
      return;
    }
    this.__startSize = this.__dialogEle.getBoundingClientRect();

    this.__dialogEle.open = false;
    this.__dialogEle.showModal();
  }
  stopViewTranstion() {
    if (!this.__startSize) {
      return;
    }
    this.__startSize = null;

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
    return this.__startSize ?? this.__dialogEle.getBoundingClientRect();
  }

  override render() {
    sharedElements.set(this, this.name, {
      old: this.oldStyle,
      new: this.newStyle,
    });
    const startSize = this.__startSize;
    return html`${cache(
        startSize
          ? html`<style>
              :host {
                width: ${startSize.width}px;
                height: ${startSize.height}px;
              }
            </style>`
          : null,
      )}
      <dialog open><slot></slot></dialog>`;
  }
}
