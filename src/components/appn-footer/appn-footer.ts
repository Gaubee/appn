/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {consume} from '@lit/context';
import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {autoBooleanProperty, type AutoBoolean} from '../../utils/auto-boolean-property-converter';
import {translucentStyle} from '../appn-header/translucent.css';
import {appnThemeContext, type AppnTheme} from '../appn-theme-provider/appn-theme-context';

/**
 * 一个用于放置在 appn-page[slot=footer] 的元素。
 * 提供了安全区域的渲染限制
 * 提供了与滚动监听相关的一些能力
 *
 * @fires stuckbottom - 当元素的粘性滚动生效时触发
 * @slot - 渲染在底部的内容，通常用来放置 appn-bottom-bar 等工具栏、导航栏等组件
 */
@customElement('appn-footer')
export class AppnFooterElement extends LitElement {
  @consume({context: appnThemeContext, subscribe: true})
  accessor #theme: AppnTheme | undefined;

  @autoBooleanProperty()
  accessor translucent: AutoBoolean = 'auto';
  static override styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        padding-bottom: var(--safe-area-inset-bottom, 0px);
      }
    `,
    translucentStyle,
  ];

  override render() {
    const translucent = (this.translucent == 'auto' && this.#theme?.class.includes('ios')) ?? false;
    this.dataset.translucent = translucent ? 'yes' : 'no';
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-footer': AppnFooterElement;
  }
}
