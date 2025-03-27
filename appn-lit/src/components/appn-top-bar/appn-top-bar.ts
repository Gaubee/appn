/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * 顶部工具栏组件，参考了 material3-top-app-bar 的标准。
 *
 * @see {@link https://m3.material.io/components/top-app-bar/guidelines}
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('appn-top-bar')
export class AppnTopBarElement extends LitElement {
  static {
    CSS.registerProperty({
      name: '--title-clamp',
      syntax: '<integer>',
      inherits: false,
      initialValue: '1',
    });
  }
  static override styles = css`
    :host {
      display: flex;
      flex-direction: row;
    }
    .leading {
      flex-shrink: 0;
      min-width: 48px;
    }
    .title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--title-clamp, 1);
      height: 2em;
      line-height: 1.8;

      font-weight: 600;
    }

    .actions {
      flex-shrink: 0;
      min-width: 48px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property({type: String, reflect: true, attribute: true})
  accessor pageTitle = '';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number, reflect: true, attribute: true})
  accessor lines = 1;

  override render() {
    return html`
      <style>
        :host {
          --title-clamp: ${this.lines};
        }
      </style>
      <div class="leading">
        <slot name="start"></slot>
      </div>
      <div class="title">
        <slot></slot>
      </div>
      <div class="actions">
        <slot name="end"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-top-bar': AppnTopBarElement;
  }
}
