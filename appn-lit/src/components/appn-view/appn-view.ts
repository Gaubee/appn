/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * 一个用于放置在 appn-page[slot=<default>] 的元素。
 * 提供了安全区域的渲染限制
 *
 * @fires stuckbottom - 当元素的粘性滚动生效时触发
 * @slot - 渲染在底部的内容，通常用来放置 appn-bottom-bar 等工具栏、导航栏等组件
 */
@customElement('appn-view')
export class AppnViewElement extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-view': AppnViewElement;
  }
}
