/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {consume} from '@lit/context';
import {LitElement, html, type PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {when} from 'lit/directives/when.js';
import {sharedElements} from '../../shim/shared-element.native/shared-element-common';
import '../appn-icon/appn-icon';
import '../appn-link/appn-link';
import {appnNavigationHistoryEntryContext} from '../appn-navigation/appn-navigation-context';
import {staticElementSharedAbleContentsStyle} from '../appn-shared-contents/appn-shared-contents-helper';
import type {CommonSharedAbleContentsElement, CommonSharedAbleContentsStyle} from '../appn-shared-contents/appn-shared-contents-types';
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
const css = String.raw;

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

//#region appn-nav-back

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
      sharedElements.set(this, 'appn-nav-back', {
        both: `width: fit-content; height: 100%;`,
      });
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
                    `,
                  )}
                </menu>`,
            )}
          `;
        },
      })}
      <css-starting-style selector="#nav-history:popover-open" cssText="scale:0.5;opacity:0.5;box-shadow:0 0 0 0 transparent;"></css-starting-style>
    `;
  }
}
//#endregion
//#region appn-nav-back-text
@customElement('appn-nav-back-text')
export class AppnNavBackTextElement extends LitElement implements CommonSharedAbleContentsElement {
  accessor #preNavs = createPreNavs(this);
  @property({type: String, reflect: true, attribute: true})
  accessor sharedName: string | null | undefined;
  @property({type: String, reflect: true, attribute: true})
  accessor sharedOldStyle: string | null | undefined;
  @property({type: String, reflect: true, attribute: true})
  accessor sharedNewStyle: string | null | undefined;
  private __ani: Animation | null = null;
  createSharedAnimation(...args: Parameters<HTMLElement['animate']>): Animation {
    let ani = this.__ani;
    if (!ani) {
      ani = this.animate(...args);
      this.__ani = ani;
      ani.finished.finally(() => {
        this.__ani = null;
      });
    }
    return ani;
  }
  getSharedStyle(): CommonSharedAbleContentsStyle {
    return staticElementSharedAbleContentsStyle(this);
  }

  protected override render() {
    const navEntry = this.#preNavs.navigationEntry;
    sharedElements.set(this, (this.sharedName = navEntry && `appn-title-${navEntry.index - 1}`), {
      both: `width:fit-content;`,
    });

    return html`<slot>
      ${this.#preNavs.task.render({
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
//#endregion

//#region appn-nav-title

@customElement('appn-nav-title')
export class AppnNavTitleElement extends LitElement implements CommonSharedAbleContentsElement {
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

  @property({type: String, reflect: true, attribute: true})
  accessor sharedName: string | null | undefined;
  @property({type: String, reflect: true, attribute: true})
  accessor sharedOldStyle: string | null | undefined;
  @property({type: String, reflect: true, attribute: true})
  accessor sharedNewStyle: string | null | undefined;
  getSharedStyle(): CommonSharedAbleContentsStyle {
    return staticElementSharedAbleContentsStyle(this);
  }
  private __ani: Animation | null = null;
  createSharedAnimation(...args: Parameters<HTMLElement['animate']>): Animation {
    let ani = this.__ani;
    if (!ani) {
      ani = this.animate(...args);
      this.__ani = ani;
      ani.finished.finally(() => {
        this.__ani = null;
      });
    }
    return ani;
  }

  protected override render() {
    const navigationEntry = this.#navigationEntry;
    set_navigation_entry_page_title(navigationEntry, this.pageTitle);
    sharedElements.set(this, (this.sharedName = navigationEntry && `appn-title-${navigationEntry?.index}`));

    return html`<slot>${this.pageTitle}</slot>
      <style>
        ${css`
          :host {
            --title-clamp: ${this.lines};
          }`}
      </style>`;
  }
}
//#endregion

declare global {
  interface HTMLElementTagNameMap {
    'appn-top-bar': AppnTopBarElement;
    'appn-nav-back': AppnNavBackElement;
    'appn-nav-back-text': AppnNavBackTextElement;
    'appn-nav-title': AppnNavTitleElement;
  }
}
