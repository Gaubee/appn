/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {consume} from '@lit/context';
import {html, LitElement, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {ResizeController} from '../../utils/resize-controller';
import {AppnNavigateEvent} from '../appn-link/appn-link';
import {appnNavigationContext, appnNavigationHistoryEntryContext} from '../appn-navigation/appn-navigation-context';
import type {AppnNavigation} from '../appn-navigation/appn-navigation-types';
import '../appn-scroll-view/appn-scroll-view';
import {appnThemeContext, type AppnTheme} from '../appn-theme-provider/appn-theme-context';
import {appnPageStyles} from './appn-page.css';

export type AppnPageMode = AppnPageElement['mode'];
export type AppnSwapbackInfo = {
  by: 'swapback';
  start: Touch;
  page: AppnPageElement;
};

const css = String.raw;
/**
 *
 */
@customElement('appn-page')
export class AppnPageElement extends LitElement {
  static override styles = appnPageStyles;
  //#region header footer

  @state()
  accessor #headerHeight = 0;
  private __headerSize = new ResizeController(
    this,
    (entry) => {
      this.#headerHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    },
    {box: 'border-box'},
  );
  @state()
  accessor #footerHeight = 0;
  private __footerSize = new ResizeController(
    this,
    (entry) => {
      this.#footerHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    },
    {box: 'border-box'},
  );

  //#endregion

  /**
   * The name to say "Hello" to.
   */
  @property({type: Boolean, reflect: true, attribute: true})
  accessor open = true;
  @property({type: String, reflect: true, attribute: true})
  accessor mode: 'screen' | 'dialog' | 'tooltip' | 'bottomsheet' | 'topsheet' | 'leftslide' | 'rightslide' = 'screen';

  @consume({context: appnThemeContext, subscribe: true})
  accessor theme!: AppnTheme;

  //#region navigation

  @property({type: String, reflect: true, attribute: true})
  accessor pathname = '*';

  @property({type: String, reflect: true, attribute: true})
  accessor search = '*';

  @property({type: String, reflect: true, attribute: true})
  accessor hash = '*';

  @property({type: Boolean, reflect: true, attribute: true})
  accessor swapback = true;

  @consume({context: appnNavigationHistoryEntryContext, subscribe: true})
  accessor navigationEntry: NavigationHistoryEntry | null = null;

  @eventProperty<AppnPageElement, AppnPageActivatedEvent>()
  accessor onactivated!: PropertyEventListener<AppnPageElement, AppnPageActivatedEvent>;
  private __activatedNavigationEntry?: unknown;

  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    const {navigationEntry} = this;
    if (navigationEntry != this.__activatedNavigationEntry) {
      this.__activatedNavigationEntry = navigationEntry;
      if (navigationEntry) {
        // console.debug('activated', navigationEntry);
        this.dispatchEvent(new AppnPageActivatedEvent(navigationEntry));
      }
    }
  }

  @eventProperty<AppnPageElement, AppnNavigateEvent>()
  accessor onswapback!: PropertyEventListener<AppnPageElement, AppnNavigateEvent>;

  @consume({context: appnNavigationContext})
  accessor #nav: AppnNavigation | null = null;
  #swapback = (() => {
    const swapback = {
      state: null as null | {start: Touch},
      start: Object.assign(
        (e: TouchEvent) => {
          if (!this.swapback) {
            return;
          }
          const start = e.touches.length !== 1 ? null : e.touches[0];
          if (start && start.clientX < 100) {
            swapback.state = {start};
            console.log('QAQ', 'swapback start!');
          }
        },
        {passive: true},
      ),
      move: Object.assign(
        (e: TouchEvent) => {
          const state = swapback.state;
          if (state == null) {
            return;
          }
          const {start} = state;
          const touch = e.touches[0];
          // TODO rtl 布局的支持
          if (touch.clientX - start.clientX > 50) {
            const nav = this.#nav;
            if (nav == null) {
              return;
            }
            console.log('QAQ', 'swapback emit!!');
            const event = new AppnNavigateEvent({type: 'back', info: {by: 'swapback', start, page: this} satisfies AppnSwapbackInfo}, 'swapback');
            this.dispatchEvent(event);
            event.applyNavigate(nav, this.navigationEntry);

            // end
            swapback.end(e);
          }
        },
        {passive: true},
      ),
      end: Object.assign(
        (e: Event) => {
          if (swapback.state) {
            console.log('QAQ', 'swapback end', e.type);
            swapback.state = null;
          }
        },
        {passive: true},
      ),
    };
    return swapback;
  })();
  //#endregion

  override render() {
    this.inert = !this.open;
    return html`
      <style>
        ${css`
          :host {
            --page-header-height: ${this.#headerHeight}px;
            --page-footer-height: ${this.#footerHeight}px;
          }`}
      </style>
      <appn-scroll-view
        class="root"
        part="root"
        @touchstart=${this.#swapback.start}
        @touchmove=${this.#swapback.move}
        @touchend=${this.#swapback.end}
        @scroll=${this.#swapback.end}
      >
        <div class="header stuck-top" part="header" ${this.__headerSize.observe()}>
          <slot name="header"></slot>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <div class="footer stuck-bottom" part="footer" ${this.__footerSize.observe()}>
          <slot name="footer"></slot>
        </div>
      </appn-scroll-view>
    `;
  }
}

export class AppnPageActivatedEvent extends CustomEvent<NavigationHistoryEntry> {
  constructor(entry: NavigationHistoryEntry) {
    super('activated', {
      detail: entry,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-page': AppnPageElement;
  }
}
