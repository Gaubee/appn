/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import '../appn-header/appn-header';

export type AppnPageMode = AppnPage['mode'];

/**
 *
 */
@customElement('appn-page')
export class AppnPage extends LitElement {
  private static __all: readonly AppnPage[] = Object.freeze([]);
  static get all() {
    return this.__all;
  }
  static {
    for (const pos of ['top', 'right', 'bottom', 'left']) {
      CSS.registerProperty({
        name: `--safe-area-inset-${pos}`,
        syntax: '<length-percentage>',
        inherits: true,
        initialValue: `env(safe-area-inset-${pos})`,
      });
    }
    for (const area of ['header', 'footer']) {
      CSS.registerProperty({
        name: `--page-${area}-height`,
        syntax: '<length-percentage>',
        inherits: true,
        initialValue: `0px`,
      });
    }
  }
  static override styles = css`
    :host {
      display: contents;
    }
    dialog {
      margin: 0;
      border: 0;
      padding: 0;
      width: fit-content;
      height: fit-content;

      background-color: #fafafa;
      border-radius: 16px;
      box-sizing: border-box;
      box-shadow: 0 0 2px -1px #000;
    }

    /* :host([mode='screen']) dialog {
      width: 100%;
      height: 100%;
    } */

    :host([mode='screen']) dialog::backdrop {
      background-color: #21212133;
    }

    /* @property --safe-area-inset-top {
      syntax: '<length-percentage>';
      inherits: true;
      initial-value: env(safe-area-inset-top);
    }
    @property --safe-area-inset-bottom {
      syntax: '<length-percentage>';
      inherits: true;
      initial-value: env(safe-area-inset-bottom);
    }
    @property --safe-area-inset-left {
      syntax: '<length-percentage>';
      inherits: true;
      initial-value: env(safe-area-inset-left);
    }
    @property --safe-area-inset-right {
      syntax: '<length-percentage>';
      inherits: true;
      initial-value: env(safe-area-inset-right);
    }
    @property --page-header-height {
      syntax: '<length-percentage>';
      inherits: true;
      initial-value: 0px;
    }
    @property --page-footer-height {
      syntax: '<length-percentage>';
      inherits: true;
      initial-value: 0px;
    } */
    .root {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: min-content 1fr min-content;
      gap: 0px 0px;
    }
    .header {
      grid-area: 1 / 1 / 2 / 2;
    }
    .body {
      grid-area: 1 / 1 / 4 / 2;
      padding-top: calc(var(--safe-area-inset-top) + var(--page-header-height));
      padding-left: var(--safe-area-inset-left);
      padding-bottom: calc(
        var(--safe-area-inset-bottom) + var(--page-footer-height)
      );
      padding-right: var(--safe-area-inset-right);

      scroll-padding-top: calc(
        var(--safe-area-inset-top) + var(--page-header-height)
      );
      scroll-padding-left: var(--safe-area-inset-left);
      scroll-padding-bottom: calc(
        var(--safe-area-inset-bottom) + var(--page-footer-height)
      );
      scroll-padding-right: var(--safe-area-inset-right);
    }
    .footer {
      grid-area: 3 / 1 / 4 / 2;
    }
  `;

  @state()
  private __headerHeight = 0;

  private __headerEleEffect?: () => void;
  protected __headerEleEffectOff() {
    this.__headerEleEffect?.();
    this.__headerEleEffect = undefined;
  }
  @query('.header')
  set headerEle(headerEle: HTMLElement) {
    this.__headerEleEffectOff();
    const resizeObserver = new ResizeObserver((entries) => {
      this.__headerHeight = entries[0].borderBoxSize[0].blockSize;
    });
    resizeObserver.observe(headerEle);
    this.__headerEleEffect = () => resizeObserver.disconnect();
  }

  /**
   * The name to say "Hello" to.
   */
  @property({type: Boolean, reflect: true, attribute: true})
  open = true;
  @property({type: String, reflect: true, attribute: true})
  mode:
    | 'screen'
    | 'dialog'
    | 'tooltip'
    | 'bottomsheet'
    | 'topsheet'
    | 'leftslide'
    | 'rightslide' = 'screen';

  // override disconnectedCallback(): void {
  //   super.disconnectedCallback();
  //   this.__headerEleEffectOff();
  // }

  override render() {
    return html`
      <style>
        :host {
          --page-header-height: ${this.__headerHeight}px;
        }
      </style>
      <dialog open="{this.open}" part="layer">
        <div class="root" part="root">
          <div class="header" part="header">
            <slot name="header">
              <appn-header>{this.pageTitle}</appn-header>
            </slot>
          </div>
          <div class="body" part="body">
            <slot></slot>
          </div>
          <div class="footer" part="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-page': AppnPage;
  }
}
