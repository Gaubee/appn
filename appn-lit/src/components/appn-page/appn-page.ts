/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {flowColorScheme} from '../../utils/match-media';
import {ResizeController} from '../../utils/resize-controller';
import '../appn-header/appn-header';
import '../appn-scroll-view/appn-scroll-view';
import {styles} from './appn-page.css';
import {provide} from '@lit/context';
import {
  appnThemeContext,
  type AppnTheme,
} from '../appn-theme/app-theme-context';
import {
  unstyledDarkTheme,
  unstyledLightTheme,
} from '../appn-theme/unstyled-theme';

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
  static override styles = styles;

  @state()
  private accessor __headerHeight = 0;
  private __headerSize = new ResizeController(
    this,
    (entry) => {
      this.__headerHeight =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    },
    {box: 'border-box'}
  );
  @state()
  private accessor __footerHeight = 0;
  private __footerSize = new ResizeController(
    this,
    (entry) => {
      this.__footerHeight =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    },
    {box: 'border-box'}
  );

  /**
   * The name to say "Hello" to.
   */
  @property({type: Boolean, reflect: true, attribute: true})
  accessor open = true;
  @property({type: String, reflect: true, attribute: true})
  accessor mode:
    | 'screen'
    | 'dialog'
    | 'tooltip'
    | 'bottomsheet'
    | 'topsheet'
    | 'leftslide'
    | 'rightslide' = 'screen';

  @property({type: String, reflect: true, attribute: 'color-scheme'})
  accessor colorScheme: 'dark' | 'light' | 'auto' = 'auto';

  private __colorSchemeFlow = flowColorScheme(this);
  get isDark() {
    return (
      (this.colorScheme === 'auto'
        ? this.__colorSchemeFlow.value
        : this.colorScheme) === 'dark'
    );
  }

  @provide({context: appnThemeContext})
  private accessor __theme: AppnTheme | undefined = undefined;
  get theme() {
    return (
      this.__theme ??
      (this.__colorSchemeFlow.value === 'dark'
        ? unstyledLightTheme
        : unstyledDarkTheme)
    );
  }
  override render() {
    const theme =
      (this.__theme ?? this.__colorSchemeFlow.value === 'dark')
        ? unstyledLightTheme
        : unstyledDarkTheme;
    this.dataset.colorScheme = this.isDark ? 'dark' : 'light';

    return html`
      <style>
        :host {
          --page-header-height: ${this.__headerHeight}px;
          --page-footer-height: ${this.__footerHeight}px;
        }
      </style>
      <dialog open=${this.open} part="layer">
        <appn-scroll-view class="root" part="root">
          <div
            class="header stuck-top"
            part="header"
            ${this.__headerSize.observe()}
          >
            <slot name="header"> </slot>
          </div>
          <div class="body" part="body">
            <slot></slot>
          </div>
          <div
            class="footer stuck-bottom"
            part="footer"
            ${this.__footerSize.observe()}
          >
            <slot name="footer"></slot>
          </div>
        </appn-scroll-view>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-page': AppnPageElement;
  }
}
