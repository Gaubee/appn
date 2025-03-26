/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
import {LitElement, html, css, CSSResult, unsafeCSS} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {ResizeController} from '../../utils/resize-controller';
import {ScrollController} from '../../utils/scroll-controller';
import {flowScrollbarOverlay} from '../../utils/match-media';

/**
 * A scroll-view element of the style 'overflow: overlay'
 * Very lightweight components that maximize the use of native capabilities:
 * - On mobile, use native support, so there is no extra overhead
 * - On the desktop, use the native scroll bar (which means you can't do too much customization)
 * - Follows the standard specifications of css scrollbar
 *
 * ## 🌍 zh-cn
 * 一个样式为 `overflow: overlay` 的滚动元素
 * 非常轻量的组件，最大化地使用了原生的能力：
 * - 在移动端上，使用原生的支持，因此不会有额外的开销
 * - 在桌面端，使用原生的滚动条来（这也就意味着你不能做太多的自定义）
 * - 遵循 css scrollbar 的标准规范
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('appn-scroll-view')
export class AppnScrollView extends LitElement {
  static override styles = css`
    @property --scrollbar-color {
      syntax: '<color>';
      inherits: true;
      initial-value: #0003;
    }
    @property --scrollbar-hover-color {
      syntax: '<color>';
      inherits: true;
      initial-value: #0006;
    }
    @property --scrollbar-size {
      syntax: '<length>';
      inherits: true;
      initial-value: 6px;
    }

    :host {
      display: block;
      overflow: auto;
      position: relative;
      overflow: scroll;
      scroll-behavior: smooth;
      container-type: size;
      container-type: size scroll-state;
      container-name: scrollview;
    }
    .content {
      width: max-content;
      height: max-content;
      z-index: 1;
      position: relative;
      transform: translateZ(0); // 渲染成独立的层
    }
    .scrollbar-sticky {
      position: sticky;
      z-index: 2;
      width: 0;
      height: 0;
      top: 0;
      left: 0;
      /* 原生滚动条不会被影响 */
      pointer-events: none;
    }
    .scrollbar-wrapper {
      width: var(--view-width);
      height: var(--view-height);
      position: relative;
    }
    .scrollbar {
      // 这里禁用平滑滚动
      scroll-behavior: auto;

      -ms-overflow-style: auto;
      position: absolute;
      pointer-events: all;
    }
    .axis-y {
      overflow-x: clip;
      overflow-y: auto;
      right: 0;
      top: 0;
      width: var(--scrollbar-track-size);
      height: calc(100% - var(--scrollbar-track-size)); /* 为 corner 预留位置 */
    }
    .axis-x {
      overflow-x: auto;
      overflow-y: clip;
      left: 0;
      bottom: 0;
      height: var(--scrollbar-track-size);
      width: calc(100% - var(--scrollbar-track-size)); /* 为 corner 预留位置 */
    }
  `;
  @property({
    type: String,
    reflect: true,
    attribute: 'scrollbar-size',
  })
  scrollbarSize: 'auto' | 'thin' | 'none' = 'auto';

  @state()
  private __contentWidth = 0;

  @state()
  private __contentHeight = 0;

  private __contentSize = new ResizeController(this, (entry) => {
    const borderBox = entry.borderBoxSize[0];
    this.__contentWidth = borderBox.inlineSize;
    this.__contentHeight = borderBox.blockSize;
  });

  @state()
  private __hostWidth = 0;

  @state()
  private __hostHeight = 0;
  private __hostSize = new ResizeController(this, (entry) => {
    const borderBox = entry.borderBoxSize[0];
    this.__hostWidth = borderBox.inlineSize;
    this.__hostHeight = borderBox.blockSize;
  });

  private __currentScrollElement?: Element;
  /** 双向绑定所有权管理
   * 一旦某一个元素开始滚动，那么它将持有滚动所有权，知道scrollend触发，才会释放所有权
   */
  private __canEffectScrollEvent(event: Event) {
    const isCurrentTarget =
      this.__currentScrollElement == null ||
      this.__currentScrollElement === event.target;

    if (event.type === 'scrollend') {
      this.__currentScrollElement = undefined;
    } else if (this.__currentScrollElement === undefined) {
      this.__currentScrollElement = event.target as Element;
    }
    return isCurrentTarget;
  }

  private __axisYScroll = new ScrollController(this, (event) => {
    if (this.__canEffectScrollEvent(event)) {
      // this.scrollTop = event.target.scrollTop;
      this.scrollTo({top: event.target.scrollTop, behavior: 'instant'});
    }
  });
  private __axisXScroll = new ScrollController(this, (event) => {
    if (this.__canEffectScrollEvent(event)) {
      // this.scrollLeft = event.target.scrollLeft;
      this.scrollTo({left: event.target.scrollLeft, behavior: 'instant'});
    }
  });

  /** 这两个元素有且只在这个 ScrollController 的回调中使用，否则需要考虑 cache=false */
  @query('.axis-y', true)
  eleAxisY!: HTMLDivElement;
  @query('.axis-x', true)
  eleAxisX!: HTMLDivElement;
  private __hostScroll = new ScrollController(this, (event) => {
    if (this.__canEffectScrollEvent(event)) {
      const {eleAxisY, eleAxisX} = this;
      eleAxisY.scrollTop = event.target.scrollTop;
      eleAxisX.scrollLeft = event.target.scrollLeft;
    }
  });

  private __getScrollbarSizePx() {
    switch (this.scrollbarSize) {
      case 'auto':
        return 10;
      case 'thin':
        return 6;
      case 'none':
        return 0;
      default:
        return 10;
    }
  }

  /// 需要同时支持 scrollbar-width 与 scrollbar-color
  private static __supportsCssScrollbar =
    CSS.supports('scrollbar-width: none') &&
    // 目前 Safari 不支持 scrollbar-color
    CSS.supports('scrollbar-color: currentColor transparent');

  private __scrollbarOverlayFlow = flowScrollbarOverlay(this);
  get canOverlayScrollbar() {
    return this.__scrollbarOverlayFlow.value;
  }

  protected override render() {
    this.__hostSize.bindElement(this);
    const {canOverlayScrollbar} = this;
    const injectCss: CSSResult[] = [];
    if (canOverlayScrollbar) {
      this.__hostScroll.unbindElement(this);
    } else {
      // 进行滚动绑定
      this.__hostScroll.bindElement(this);
      /// 需要自己绘制 scrollbar
      const scrollbarSize = this.__getScrollbarSizePx();
      injectCss.push(css`
        :host {
          --scrollbar-size: ${scrollbarSize}px;
          --scrollbar-color: #0003;
          --scrollbar-hover-color: #0006;
        }
        @media (prefers-color-scheme: dark) {
          :host {
            --scrollbar-color: #fff6;
            --scrollbar-hover-color: #fff9;
          }
        }
        .mock-content {
          width: calc(${this.__contentWidth}px - var(--scrollbar-track-size));
          height: calc(${this.__contentHeight}px - var(--scrollbar-track-size));
        }
      `);
      /**
       * 首先隐藏最顶层的 scrollbar
       * 然后渲染自定义的 scrollbar
       */
      if (AppnScrollView.__supportsCssScrollbar) {
        injectCss.push(css`
          :host {
            --scrollbar-track-size: ${scrollbarSize + 4}px;
            scrollbar-width: none;
          }
          .scrollbar {
            scrollbar-width: ${unsafeCSS(this.scrollbarSize)};
            scrollbar-color: var(--scrollbar-color) transparent;
          }
          .scrollbar:hover {
            scrollbar-color: var(--scrollbar-hover-color) transparent;
          }
        `);
      } else {
        injectCss.push(css`
          :host {
            --scrollbar-track-size: ${scrollbarSize}px;
          }
          :host::-webkit-scrollbar {
            width: 0px;
            height: 0px;
          }

          .scrollbar::-webkit-scrollbar {
            width: ${scrollbarSize}px;
            height: ${scrollbarSize}px;
          }
          .scrollbar::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-color);
            border-radius: ${scrollbarSize}px;
            border: 2px solid transparent;
          }
          .scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-hover-color);
          }
          .scrollbar::-webkit-scrollbar-track {
            background-color: transparent;
          }
          .scrollbar::-webkit-scrollbar-corner {
            background-color: transparent;
          }
        `);
      }
    }
    return html`
      <style>
        ${injectCss}

        /* 盒子的宽高，用于子元素计算滚动内容 */
        :host {
          --view-width: ${this.__hostWidth}px;
          --view-height: ${this.__hostHeight}px;
        }
      </style>
      <div class="scrollbar-sticky">
        ${canOverlayScrollbar
          ? ''
          : html`<div class="scrollbar-wrapper">
              <div
                part="scrollbar"
                class="scrollbar axis-y"
                ${this.__axisYScroll.observe()}
              >
                <div class="mock-content"></div>
              </div>
              <div
                part="scrollbar"
                class="scrollbar axis-x"
                ${this.__axisXScroll.observe()}
              >
                <div class="mock-content"></div>
              </div>
            </div>`}
      </div>
      <div part="content" class="content" ${this.__contentSize.observe()}>
        <slot></slot>
      </div>
    `;
  }
}
