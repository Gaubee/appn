/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {consume} from '@lit/context';
import {Task} from '@lit/task';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../appn-icon/appn-icon';
import '../appn-link/appn-link';
import {appnNavigationContext, appnNavigationHistoryEntryContext, type AppnNavigation} from '../appn-navigation-provider/appn-navigation-context';
import {nav_pre_history_entry, nav_set_current_state_kv, nav_state_get_kv} from '../appn-navigation-provider/internal/appn-navigation-helper';
import {appnTopBarStyle} from './appn-top-bar.css';

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
  static override styles = appnTopBarStyle;

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
  @consume({context: appnNavigationContext})
  private accessor __nav: AppnNavigation | null = null;

  @consume({context: appnNavigationHistoryEntryContext})
  private accessor __navigationEntry: NavigationHistoryEntry | null = null;

  private __preNavTask = new Task(this, {
    task: ([nav, currentNavEntryId]) => {
      return nav_pre_history_entry(nav, currentNavEntryId);
    },
    args: () => [this.__nav, this.__navigationEntry?.id],
  });

  override render() {
    console.log('QAQ top-bar title', this.__navigationEntry?.id, this.pageTitle);
    void nav_set_current_state_kv(this.__nav, 'pageTitle', this.pageTitle);

    return html`
      <style>
        :host {
          --title-clamp: ${this.lines};
        }
      </style>
      <div class="leading">
        <slot name="start">
          ${this.__preNavTask.render({
            complete: (preNavEntry) => {
              const prePageTitle = nav_state_get_kv(preNavEntry, 'pageTitle');
              console.log('QAQ top-bar pre', preNavEntry?.id, prePageTitle);
              if (prePageTitle) {
                return html`<appn-link mode="back" type="text-button">
                  <appn-icon name="chevron.backward"></appn-icon>
                  ${prePageTitle}
                </appn-link>`;
              }
              return;
            },
          })}
        </slot>
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
