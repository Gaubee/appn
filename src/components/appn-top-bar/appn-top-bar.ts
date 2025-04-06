/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {consume} from '@lit/context';
import {Task} from '@lit/task';
import {LitElement, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import '../appn-icon/appn-icon';
import '../appn-link/appn-link';
import {appnNavigationContext, appnNavigationHistoryEntryContext, type AppnNavigation} from '../appn-navigation-provider/appn-navigation-context';
import {nav_before_history_entries, nav_set_current_state_kv, nav_state_get_kv} from '../appn-navigation-provider/internal/appn-navigation-helper';
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

  private __preNavsTask = new Task(this, {
    task: ([nav, currentNavEntryId]) => {
      return nav_before_history_entries(nav, currentNavEntryId);
    },
    args: () => [this.__nav, this.__navigationEntry?.id],
  });

  @query('#nav-history')
  private accessor __navHistoryEle!: HTMLDivElement | null;

  override render() {
    void nav_set_current_state_kv(this.__nav, 'pageTitle', this.pageTitle);

    return html`
      <style>
        :host {
          --title-clamp: ${this.lines};
        }
        appn-link {
          user-select: none;
        }
        .leading {
          anchor-name: --back-button;
        }
        #nav-history {
          position-area: center;
          position-anchor: --back-button;
          backdrop-filter: blur(20px) contrast(0.5) brightness(max(var(--_light-brightness), var(--_dark-brightness)));

          width: max-content;
          flex-direction: column;
          border-radius: var(--grid-unit);
          background: unset;
          border: unset;
          color: var(--color-canvas-text);
          box-shadow: 0 1px 4px -2px var(--color-canvas-text);
        }
        #nav-history li {
          list-style: none;
        }
        #nav-history:popover-open {
          display: flex;
        }
      </style>
      <div class="leading">
        <slot name="start">
          ${this.__preNavsTask.render({
            complete: (preNavEntries) => {
              if (!preNavEntries || preNavEntries.length === 0) {
                return;
              }
              const prePageTitle = nav_state_get_kv<string>(preNavEntries.at(-1), 'pageTitle');
              return html`
                <appn-link
                  class="back-button"
                  mode="back"
                  type="text-button"
                  @contextmenu=${(e: Event) => {
                    e.preventDefault();
                    console.log(e);
                    this.__navHistoryEle?.showPopover();
                  }}
                >
                  <appn-icon name="chevron.backward" widget="bold"></appn-icon>
                  ${prePageTitle}
                </appn-link>
                ${when(
                  preNavEntries.length > 0,
                  () =>
                    html`<menu popover id="nav-history">
                      ${preNavEntries.map(
                        (entry) => html`
                          <li>
                            <appn-link mode="back" to-key="${entry.key}" type="text-button" @click=${() => this.__navHistoryEle?.hidePopover()}>
                              ${nav_state_get_kv(entry, 'pageTitle')}
                            </appn-link>
                          </li>
                        `
                      )}
                    </menu>`
                )}
              `;
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
