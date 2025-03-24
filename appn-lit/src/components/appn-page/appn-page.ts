/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {
  CSSResult,
  LitElement,
  css,
  html,
  unsafeCSS,
  type PropertyValues,
} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {getScrollbarOverlayFlow} from '../../utils/match-media';
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
  static override styles = (() => {
    const dark = (cssText: string | CSSResult) => {
      cssText = cssText.toString().trim();
      if (false === cssText.startsWith(':host')) {
        cssText = ' ' + cssText;
      }

      return unsafeCSS(`
        :host([colorscheme='dark'])${cssText}
        @media (prefers-color-scheme: dark) {
          :host([colorscheme='auto'])${cssText}
        }
      `);
    };
    return css`
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
        overflow: hidden;

        color: #333;
        background-color: #fafafa;
        border-radius: 16px;
        box-sizing: border-box;
        box-shadow: 0 0 2px -1px #000;
      }
      ${dark(css`
        dialog {
          color: #fff;
          background-color: #333;
        }
      `)}

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
      ${dark(css`
        :host([mode='screen']) dialog::backdrop {
          background-color: #fff9;
        }
      `)}

      .root {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content 1fr min-content;
        gap: 0px 0px;
        width: 100%;
        height: 100%;
      }
      .scrollable {
        overflow: auto;
        scroll-behavior: smooth;
        scrollbar-gutter: stable both-edges;
        scrollbar-width: thin; /* 11px */
        scrollbar-color: #0003 transparent;
      }

      ${dark(css`
        .scrollable {
          scrollbar-color: #fff9 transparent;
        }
      `)}

      .header {
        grid-area: 1 / 1 / 2 / 2;
        z-index: 3;
        position: sticky;
        top: 0;
      }
      .translucent {
        backdrop-filter: blur(20px) contrast(0.5) brightness(1.5);
      }
      ${dark(css`
        .translucent {
          backdrop-filter: blur(20px) contrast(0.5) brightness(0.5);
        }
      `)}

      .body {
        grid-area: 1 / 1 / 4 / 2;
        z-index: 1;
        --_pt: calc(var(--safe-area-inset-top) + var(--page-header-height));
        --_pb: calc(var(--safe-area-inset-bottom) + var(--page-footer-height));

        padding-top: var(--_pt);
        padding-bottom: var(--_pb);
        scroll-padding-top: var(--_pt);
        scroll-padding-bottom: var(--_pb);

        /** 在桌面端，page-padding-line 使用 scrollbar: both-edges 来提供支撑 */
        /** 在桌面端，page-padding-line 使用 max(safe-area-inset, 0.5em) 来提供支撑 */
        --_pl: max(var(--safe-area-inset-left), var(--_scrollbar-base, 0px));
        --_pr: max(var(--safe-area-inset-right), var(--_scrollbar-base, 0px));
        padding-left: var(--_pl);
        padding-right: var(--_pr);
        scroll-padding-left: var(--_pl);
        scroll-padding-right: var(--_pr);
      }

      .footer {
        grid-area: 3 / 1 / 4 / 2;
        z-index: 2;
        position: sticky;
        bottom: 0;
      }
      ::slotted(*) {
        /* 3D加速可以顺便解决 scrollbar: both-edges 带来的边缘裁切的BUG */
        transform: translateZ(0);
      }
    `;
  })();

  private __headerEleEffect?: () => void;
  protected __headerEleEffectOff() {
    this.__headerEleEffect?.();
    this.__headerEleEffect = undefined;
  }
  @query('.header')
  private headerEle!: HTMLElement;
  @query('.footer')
  private footerEle!: HTMLElement;

  private __headerResizeObserver?: ResizeObserver;
  private __headerHeight = 0;
  private __footerResizeObserver?: ResizeObserver;
  private __footerHeight = 0;

  override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    // 确保元素已挂载后初始化
    this.__setupElementResizeObserver('header', this.headerEle, (height) => {
      this.__headerHeight = height;
      this.requestUpdate();
    });
    this.__setupElementResizeObserver('footer', this.footerEle, (height) => {
      this.__footerHeight = height;
      this.requestUpdate();
    });
  }

  override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    if (_changedProperties.has('headerEle')) {
      // 元素引用变化时重新设置监听
      this.__setupElementResizeObserver('header', this.headerEle, (height) => {
        this.__headerHeight = height;
        this.requestUpdate();
      });
    }
    if (_changedProperties.has('footerEle')) {
      // 元素引用变化时重新设置监听
      this.__setupElementResizeObserver('footer', this.footerEle, (height) => {
        this.__footerHeight = height;
        this.requestUpdate();
      });
    }
  }

  private __setupElementResizeObserver(
    type: 'header' | 'footer',
    element: HTMLElement,
    callback: (height: number) => void
  ) {
    // 先清理旧监听器
    if (type === 'header') {
      this.__headerResizeObserver?.disconnect();
    } else {
      this.__footerResizeObserver?.disconnect();
    }

    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 兼容性处理（不同浏览器实现不同）
        const blockSize =
          entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height;
        callback(blockSize);
      }
    });

    resizeObserver.observe(element);

    // 保存观察器引用
    if (type === 'header') {
      this.__headerResizeObserver = resizeObserver;
    } else {
      this.__footerResizeObserver = resizeObserver;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    // 组件卸载时清理
    this.__headerResizeObserver?.disconnect();
    this.__footerResizeObserver?.disconnect();
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

  @property({type: String, reflect: true, attribute: true})
  colorScheme: 'dark' | 'light' | 'auto' = 'auto';

  // override disconnectedCallback(): void {
  //   super.disconnectedCallback();
  //   this.__headerEleEffectOff();
  // }
  @property({type: String, reflect: true, attribute: true})
  pageTitle = '';

  private __scrollbarOverlayFlow = (() => {
    const flow = getScrollbarOverlayFlow();
    flow.watch(() => {
      this.requestUpdate();
    });
    return flow;
  })();
  override render() {
    return html`
      <style>
        :host {
          --page-header-height: ${this.__headerHeight}px;
          --page-footer-height: ${this.__footerHeight}px;
        }
        /* 在移动端，scrollbar是overlay的，这里默认提供了0.5em的padding，来让 */
        .scrollable {
          --_scrollbar-base: ${this.__scrollbarOverlayFlow.value
            ? '0.5em'
            : '0px'};
        }
      </style>
      <dialog open=${this.open} part="layer">
        <div class="root" part="root">
          <div class="header translucent" part="header">
            <slot name="header">
              <appn-header>${this.pageTitle}</appn-header>
            </slot>
          </div>
          <div class="body scrollable" part="body">
            <slot></slot>
          </div>
          <div class="footer translucent" part="footer">
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
