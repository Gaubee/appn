/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {consume} from '@lit/context';
import {LitElement, css, html, type PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import '../appn-icon/appn-icon';
import '../appn-link/appn-link';
import {appnNavigationHistoryEntryContext} from '../appn-navigation/appn-navigation-context';
import '../css-starting-style/css-starting-style';
import {createPreNavs} from './appn-top-bar-context';
import {appnNavBackStyle, appnNavTitleStyle, appnTopBarStyle} from './appn-top-bar.css';

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

  override render() {
    return html`
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

@customElement('appn-nav-back')
export class AppnNavBackElement extends LitElement {
  static override styles = appnNavBackStyle;

  accessor #preNavs = createPreNavs(this);

  @query('#nav-history')
  accessor #navHistoryEle!: HTMLDivElement | null;
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    const navEntry = this.#preNavs.navigationEntry;
    if (navEntry) {
      this.dataset.sharedElement = 'appn-nav-back';
      this.dataset.sharedElementNewStyle = `width:100%;`;
      this.dataset.sharedElementOldStyle = `width:100%;`;
    }
  }
  override render() {
    return html`
      ${this.#preNavs.task.render({
        complete: (preNavEntries) => {
          if (!preNavEntries || preNavEntries.length === 0) {
            return;
          }
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
              <slot></slot>
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
      <css-starting-style selector="#nav-history:popover-open" cssText="scale:0.5;opacity:0.5;box-shadow:0 0 0 0 transparent;"></css-starting-style>
    `;
  }
}
@customElement('appn-nav-back-text')
export class AppnNavBackTextElement extends LitElement {
  accessor #preNavs = createPreNavs(this);

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    const navigationEntry = this.#preNavs.navigationEntry;
    if (navigationEntry) {
      const pre_index = navigationEntry.index - 1;
      this.dataset.sharedElement = `appn-title-${pre_index}`;
      this.dataset.sharedElementNewStyle = `width:fit-content;`;
      this.dataset.sharedElementOldStyle = `width:fit-content;`;
    }
  }
  protected override render() {
    return html`<slot>
      ${this.#preNavs.task?.render({
        complete: (preNavEntries) => {
          if (!preNavEntries || preNavEntries.length === 0) {
            return;
          }
          const prePageTitle = get_navigation_entry_page_title(preNavEntries.at(-1));
          return prePageTitle;
        },
      })}
    </slot>`;
  }
}
@customElement('appn-nav-title')
export class AppnNavTitleElement extends LitElement {
  static override styles = appnNavTitleStyle;

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number, reflect: true, attribute: true})
  accessor lines = 1;

  @consume({context: appnNavigationHistoryEntryContext, subscribe: true})
  accessor #navigationEntry: NavigationHistoryEntry | null = null;
  /**
   * The name to say "Hello" to.
   */
  @property({type: String, reflect: true, attribute: true})
  accessor pageTitle = '';

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    const navigationEntry = this.#navigationEntry;
    if (navigationEntry) {
      this.dataset.sharedElement = `appn-title-${navigationEntry.index}`;
      // this.dataset.sharedElementStyle = `z-index:${navigationEntry.index + 1};`;
    }
  }
  protected override render() {
    set_navigation_entry_page_title(this.#navigationEntry, this.pageTitle);

    return html`<slot>${this.pageTitle}</slot>
      <style>
        ${css`
          :host {
            --title-clamp: ${this.lines};
          }`}
      </style>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-top-bar': AppnTopBarElement;
    'appn-nav-back': AppnNavBackElement;
    'appn-nav-back-text': AppnNavBackTextElement;
  }
}
