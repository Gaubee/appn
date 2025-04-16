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
import {nav_before_history_entries} from '../appn-navigation-provider/internal/appn-navigation-helper';
import '../css-starting-style/css-starting-style';
import {appnTopBarStyle} from './appn-top-bar.css';

const navigation_entry_page_title_wm = new WeakMap<NavigationHistoryEntry, string>();
const get_navigation_entry_page_title = (entry: NavigationHistoryEntry | null | undefined) => {
  return entry ? navigation_entry_page_title_wm.get(entry) : undefined;
};
const set_navigation_entry_page_title = (entry: NavigationHistoryEntry | null | undefined, page_title: string) => {
  if (entry) {
    navigation_entry_page_title_wm.set(entry, page_title);
  }
};

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
  accessor #nav: AppnNavigation | null = null;

  @consume({context: appnNavigationHistoryEntryContext, subscribe: true})
  accessor #navigationEntry: NavigationHistoryEntry | null = null;

  private __preNavsTask = new Task(this, {
    task: ([nav, currentNavEntryId]) => {
      return nav_before_history_entries(nav, currentNavEntryId);
    },
    args: () => [this.#nav, this.#navigationEntry?.id],
  });

  @query('#nav-history')
  accessor #navHistoryEle!: HTMLDivElement | null;

  override render() {
    set_navigation_entry_page_title(this.#navigationEntry, this.pageTitle);

    return html`
      <style>
        :host {
          --title-clamp: ${this.lines};
        }
      </style>
      <div class="leading">
        <slot name="start">
          ${this.__preNavsTask.render({
            complete: (preNavEntries) => {
              if (!preNavEntries || preNavEntries.length === 0) {
                return;
              }
              const prePageTitle = get_navigation_entry_page_title(preNavEntries.at(-1));
              return html`
                <appn-link
                  class="back-button"
                  mode="back"
                  type="text-button"
                  @contextmenu=${(e: Event) => {
                    e.preventDefault();
                    this.#navHistoryEle?.showPopover();
                  }}
                >
                  <appn-icon name="chevron.backward" widget="bold"></appn-icon>
                  ${prePageTitle}
                </appn-link>
                ${when(
                  preNavEntries.length > 0,
                  () =>
                    html`<menu popover id="nav-history">
                      ${preNavEntries.reverse().map(
                        (entry) => html`
                          <li>
                            <appn-link mode="back" to-key="${entry.key}" type="text-button" actionType="pointerup" @navigate=${() => this.#navHistoryEle?.hidePopover()}>
                              ${get_navigation_entry_page_title(entry)}
                            </appn-link>
                          </li>
                          <hr />
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
      <css-starting-style selector="#nav-history:popover-open" cssText="scale:0.5;opacity:0.5;box-shadow:0 0 0 0 transparent;"></css-starting-style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-top-bar': AppnTopBarElement;
  }
}
