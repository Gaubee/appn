import {html, LitElement} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {sharedElements} from '../../shim/shared-element.native';
import type {CommonSharedAbleContentsElement, CommonSharedAbleContentsStyle} from './appn-shared-contents-types';
import {appnSharedStyle} from './appn-shared-contents.css';

@customElement('appn-shared-contents')
export class AppnSharedContentsElement extends LitElement implements CommonSharedAbleContentsElement {
  static override styles = appnSharedStyle;

  @property({type: String, reflect: true, attribute: true})
  accessor sharedName!: string;

  @property({type: String, reflect: true, attribute: true})
  accessor sharedOldStyle!: string;
  @property({type: String, reflect: true, attribute: true})
  accessor sharedNewStyle!: string;

  private accessor __sharedAnimation: Animation | null = null;

  @state()
  private accessor __startBounding: DOMRect | null = null;

  @query('dialog', true)
  private accessor __dialogEle!: HTMLDialogElement;

  createSharedAnimation(...args: Parameters<HTMLElement['animate']>) {
    let ani = this.__sharedAnimation;
    if (!ani) {
      const dialogEle = this.__dialogEle;
      this.__startBounding = dialogEle.getBoundingClientRect();
      dialogEle.close();
      dialogEle.showModal();
      ani = dialogEle.animate(...args);
      this.__sharedAnimation = ani;
      ani.finished.finally(() => {
        this.__sharedAnimation = null;
        this.__startBounding = null;
        dialogEle.close();
        dialogEle.show();
      });
    }
    return ani;
  }
  getSharedStyle(): CommonSharedAbleContentsStyle {
    return {
      boudingRect: this.__startBounding ?? this.__dialogEle.getBoundingClientRect(),
      baseStyle: {
        margin: 0,
        borderWidth: 0,
      },
    };
  }

  override render() {
    sharedElements.set(this, this.sharedName, {
      old: this.sharedOldStyle,
      new: this.sharedNewStyle,
    });
    const startSize = this.__startBounding;
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
