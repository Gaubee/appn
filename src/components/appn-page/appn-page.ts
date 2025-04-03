/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {LitElement, html, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {ResizeController} from '../../utils/resize-controller';
import '../appn-scroll-view/appn-scroll-view';
import {appnPageStyles} from './appn-page.css';
import {consume} from '@lit/context';
import {appnThemeContext, type AppnTheme} from '../appn-theme-provider/appn-theme-context';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {appnNavigationHistoryEntryContext} from '../appn-navigation-provider/appn-navigation-context';

export type AppnPageMode = AppnPageElement['mode'];

/**
 *
 */
@customElement('appn-page')
export class AppnPageElement extends LitElement {
  private static __all: readonly AppnPageElement[] = Object.freeze([]);
  static get all() {
    return this.__all;
  }
  static override styles = appnPageStyles;

  @state()
  private accessor __headerHeight = 0;
  private __headerSize = new ResizeController(
    this,
    (entry) => {
      this.__headerHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    },
    {box: 'border-box'}
  );
  @state()
  private accessor __footerHeight = 0;
  private __footerSize = new ResizeController(
    this,
    (entry) => {
      this.__footerHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    },
    {box: 'border-box'}
  );

  /**
   * The name to say "Hello" to.
   */
  @property({type: Boolean, reflect: true, attribute: true})
  accessor open = true;
  @property({type: String, reflect: true, attribute: true})
  accessor mode: 'screen' | 'dialog' | 'tooltip' | 'bottomsheet' | 'topsheet' | 'leftslide' | 'rightslide' = 'screen';

  @consume({context: appnThemeContext, subscribe: true})
  accessor theme!: AppnTheme;

  @property({type: String, reflect: true, attribute: true})
  accessor pathname = '*';

  @property({type: String, reflect: true, attribute: true})
  accessor search = '*';

  @property({type: String, reflect: true, attribute: true})
  accessor hash = '*';

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
        console.log('activated', navigationEntry);
        this.dispatchEvent(new AppnPageActivatedEvent(navigationEntry));
      }
    }
  }

  override render() {
    this.inert = !this.open;
    return html`
      <style>
        :host {
          --page-header-height: ${this.__headerHeight}px;
          --page-footer-height: ${this.__footerHeight}px;
        }
      </style>
      <div class="layer" part="layer">
        <appn-scroll-view class="root" part="root">
          <div class="header stuck-top" part="header" ${this.__headerSize.observe()}>
            <slot name="header"> </slot>
          </div>
          <div class="body" part="body">
            <slot></slot>
          </div>
          <div class="footer stuck-bottom" part="footer" ${this.__footerSize.observe()}>
            <slot name="footer"></slot>
          </div>
        </appn-scroll-view>
      </div>
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
