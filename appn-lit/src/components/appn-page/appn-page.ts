/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, css, html, type PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
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
    console.log(18);
    for (const pos of ['top', 'right', 'bottom', 'left']) {
      CSS.registerProperty({
        name: `--safe-area-inset-${pos}`,
        syntax: '<length-percentage>',
        inherits: true,
        initialValue: '0px',
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
      --safe-area-inset-top: env(safe-area-inset-top);
      --safe-area-inset-bottom: env(safe-area-inset-bottom);
      --safe-area-inset-left: env(safe-area-inset-left);
      --safe-area-inset-right: env(safe-area-inset-right);
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

    :host([mode='block']) dialog {
      position: relative;
    }

    :host([mode='screen']) dialog {
      width: 100%;
      height: 100%;
    }

    :host([mode='screen']) dialog::backdrop {
      background-color: #21212133;
    }

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

  private __headerEleEffect?: () => void;
  protected __headerEleEffectOff() {
    this.__headerEleEffect?.();
    this.__headerEleEffect = undefined;
  }
  @query('.header')
  private headerEle!: HTMLElement;

  private __resizeObserver?: ResizeObserver;
  private __headerHeight = 0;

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    // 确保元素已挂载后初始化
    this.__setupResizeObserver();
  }

  override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    if (_changedProperties.has('headerEle')) {
      // 元素引用变化时重新设置监听
      this.__setupResizeObserver();
    }
  }

  private __setupResizeObserver() {
    // 先清理旧监听器
    this.__resizeObserver?.disconnect();

    if (!this.headerEle) return;

    this.__resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 兼容性处理（不同浏览器实现不同）
        const blockSize =
          entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height;
        this.__headerHeight = blockSize;
        this.requestUpdate(); // 触发重新渲染
      }
    });

    this.__resizeObserver.observe(this.headerEle);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // 组件卸载时清理
    this.__resizeObserver?.disconnect();
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
  @property({type: String, reflect: true, attribute: true})
  pageTitle = '';

  override render() {
    return html`
      <style>
        :host {
          --page-header-height: ${this.__headerHeight}px;
        }
      </style>
      <dialog open=${this.open} part="layer">
        <div class="root" part="root">
          <div class="header" part="header">
            <slot name="header">
              <appn-header>${this.pageTitle}</appn-header>
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
