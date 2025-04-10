/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {consume} from '@lit/context';
import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {autoBooleanProperty, type AutoBoolean} from '../../utils/auto-boolean-property-converter';
import {appnThemeContext, type AppnTheme} from '../appn-theme-provider/appn-theme-context';
import {translucentStyle} from './translucent.css';

/**
 * 一个用于放置在 appn-page[slot=header] 的元素。
 * 提供了安全区域的渲染限制
 * 提供了与滚动监听相关的一些能力
 *
 * @fires stucktop - 当元素的粘性滚动生效时触发
 * @slot - 渲染在头部的内容，通常用来放置 appn-top-bar 等工具栏、导航栏等组件
 */
@customElement('appn-header')
export class AppnHeaderElement extends LitElement {
  @consume({context: appnThemeContext, subscribe: true})
  accessor #theme: AppnTheme | undefined;

  @autoBooleanProperty()
  accessor translucent: AutoBoolean = 'auto';

  static override styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        padding-top: var(--safe-area-inset-top, 0px);
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
    'appn-header': AppnHeaderElement;
  }
}
