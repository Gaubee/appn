/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
import {css, CSSResult, html, LitElement, unsafeCSS} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {flowScrollbarOverlay} from '../../utils/match-media';
import {ResizeController} from '../../utils/resize-controller';
import {ScrollController} from '../../utils/scroll-controller';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {appnScrollViewStyle} from './appn-scroll-view.css';

/**
 * A scroll-view element of the style 'overflow: overlay'.
 * lightweight components that maximize the use of native capabilities.
 *
 * Core features:
 * - Mobile: Zero-overhead native scrolling
 * - Desktop: Native scrollbars (limited styling)
 * - CSS Scrollbars specification compliant
 *
 * @fires scrollend - Provides polyfill for browsers without native scrollend support
 * @slot - Scrollable content container
 * @csspart scrollbar - Scrollbar track
 * @csspart axis-y - Vertical scrollbar track
 * @csspart axis-x - Horizontal scrollbar track
 * @csspart content - Content container
 *
 * <i18n lang="zh-cn">
 * 一个样式为 `overflow: overlay` 的滚动元素
 * 非常轻量的组件，最大化地使用了原生的能力.
 *
 * 核心特性：
 * - 移动端：无额外开销的原生滚动
 * - 桌面端：原生滚动条（样式定制受限）
 * - 符合 CSS 滚动条标准规范
 *
 * @fires scrollend - 为不支持原生scrollend事件的浏览器提供垫片
 * @slot - 滚动内容容器
 * @csspart scrollbar - 滚动条轨道
 * @csspart axis-y - 垂直滚动条轨道
 * @csspart axis-x - 水平滚动条轨道
 * @csspart content - 内容容器
 * </i18n>
 */
@customElement('appn-scroll-view')
export class AppnScrollViewElement extends LitElement {
  static override styles = appnScrollViewStyle;
  @property({
    type: String,
    reflect: true,
    attribute: 'scrollbar-size',
  })
  accessor scrollbarSize: 'auto' | 'thin' | 'none' = 'auto';

  @property({
    type: String,
  })
  accessor scrollbarColor: string = '';

  @eventProperty()
  override accessor onscrollend!: PropertyEventListener;
  @eventProperty()
  override accessor onscroll!: PropertyEventListener;

  @state()
  private accessor __contentWidth = 0;

  @state()
  private accessor __contentHeight = 0;

  private __contentSize = new ResizeController(this, (entry) => {
    const borderBox = entry.borderBoxSize[0];
    this.__contentWidth = borderBox.inlineSize;
    this.__contentHeight = borderBox.blockSize;
  });

  @state()
  private accessor __hostWidth = 0;

  @state()
  private accessor __hostHeight = 0;
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
    const isCurrentTarget = this.__currentScrollElement == null || this.__currentScrollElement === event.target;

    if (event.type === 'scrollend') {
      this.__currentScrollElement = undefined;
    } else if (this.__currentScrollElement === undefined) {
      this.__currentScrollElement = event.target as Element;
    }
    return isCurrentTarget;
  }

  private __axisYScroll = new ScrollController(
    this,
    (event) => {
      if (this.__canEffectScrollEvent(event)) {
        // this.scrollTop = event.target.scrollTop;
        this.scrollTo({top: event.target.scrollTop, behavior: 'instant'});
      }
    },
    {
      init: (element) => {
        element.scrollTop = this.scrollTop;
      },
    }
  );
  private __axisXScroll = new ScrollController(
    this,
    (event) => {
      if (this.__canEffectScrollEvent(event)) {
        // this.scrollLeft = event.target.scrollLeft;
        this.scrollTo({left: event.target.scrollLeft, behavior: 'instant'});
      }
    },
    {
      init: (element) => {
        element.scrollLeft = this.scrollLeft;
      },
    }
  );

  private __hostScroll = new ScrollController(this, (event) => {
    if (this.__canEffectScrollEvent(event)) {
      const eleAxisX = this.__axisXScroll.bindingElement;
      const eleAxisY = this.__axisYScroll.bindingElement;
      if (eleAxisX && eleAxisY) {
        const host = event.target;
        eleAxisY.scrollTop = host.scrollTop;
        eleAxisX.scrollLeft = host.scrollLeft;
      }
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
      if (AppnScrollViewElement.__supportsCssScrollbar) {
        injectCss.push(css`
          :host {
            --scrollbar-track-size: ${scrollbarSize + 4}px;
            scrollbar-width: none;
          }
          .scrollbar {
            scrollbar-width: ${unsafeCSS(this.scrollbarSize)};
            scrollbar-color: var(--scrollbar-color) transparent;
            transition-property: scrollbar-color;
            transition-duration: 250ms;
            transition-timing-function: ease-out;
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
            /**不支持动画 */
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
        ${cache(
          canOverlayScrollbar
            ? null
            : html`<div class="scrollbar-wrapper">
                <div part="scrollbar axis-y" class="scrollbar axis-y" role="scrollbar" ${this.__axisYScroll.observe()}>
                  <div class="mock-content" .inert=${true}></div>
                </div>
                <div part="scrollbar axis-x" class="scrollbar axis-x" role="scrollbar" ${this.__axisXScroll.observe()}>
                  <div class="mock-content" .inert=${true}></div>
                </div>
              </div>`
        )}
      </div>
      <div part="content" class="content" ${this.__contentSize.observe()}>
        <slot></slot>
      </div>
    `;
  }
}
