/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('appn-header')
export class AppnHeader extends LitElement {
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
    @property --title-clamp {
      syntax: '<number>';
    }
    .title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: var(--title-clamp, 1);
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
  pageTitle = '';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number, reflect: true, attribute: true})
  lines = 1;

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
    'appn-header': AppnHeader;
  }
}
