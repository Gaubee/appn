/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {translucentStyle} from '../appn-header/translucent.css';

/**
 * 一个用于提供 ios 主题的容器
 * 放置于内部的元素，默认会启用 ios 风格。开发者仍然可以在此基础上进行一些定制
 */
@customElement('appn-ios-theme')
export class AppnIosThemeElement extends LitElement {
  static override styles = [
    css`
      :host {
        display: contents;
      }
      ::slotted(*) {
        --appn-font-family:
      /* 英文字体优先链 */
          -apple-system /* 系统自动调用 San Francisco (iOS/macOS) */,
          BlinkMacSystemFont /* Chrome 的 San Francisco 回退方案 */,
          'Helvetica Neue' /* iOS 7-8 及旧版 macOS 回退 */,
          'Segoe UI' /* Windows 系统适配 */,
          /* 中文字体优先链 */ 'PingFang SC' /* 苹方简体 (iOS 9+) */,
          'Hiragino Sans GB' /* 冬青黑体 (旧版 macOS 中文回退) */,
          'Microsoft YaHei' /* 微软雅黑 (Windows 中文适配) */,
          sans-serif /* 通用无衬线兜底 */;
        font-family: var(--appn-font-family);
        appn-page[data-color-scheme='light'] {
          --system-color-canvas-text: #1d1d1f;
        }
        appn-page[data-color-scheme='dark'] {
          --system-color-canvas: #1c1c1e;
        }
      }
    `,
    translucentStyle,
  ];

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-ios-theme': AppnIosThemeElement;
  }
}
