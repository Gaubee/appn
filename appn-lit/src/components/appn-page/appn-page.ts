/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {flowColorScheme, flowScrollbarOverlay} from '../../utils/match-media';
import {ResizeController} from '../../utils/resize-controller';
import '../appn-header/appn-header';
import '../appn-scroll-view/appn-scroll-view';
import {styles} from './appn-page.css';

export type AppnPageMode = AppnPage['mode'];

/**
 *
 */
@customElement('appn-page')
export class AppnPage extends LitElement {
  private static __all: readonly AppnPage[] = Object.freeze([]);
  static get all() {
    return this.__all;
  }
  static override styles = styles;

  @state()
  private __headerHeight = 0;
  private __headerSize = new ResizeController(
    this,
    (entry) => {
      this.__headerHeight =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    },
    {box: 'border-box'}
  );
  @state()
  private __footerHeight = 0;
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
  open = true;
  @property({type: String, reflect: true, attribute: true})
  mode:
    | 'screen'
    | 'dialog'
    | 'tooltip'
    | 'bottomsheet'
    | 'topsheet'
    | 'leftslide'
    | 'rightslide' = 'screen';

  @property({type: String, reflect: true, attribute: 'color-scheme'})
  colorScheme: 'dark' | 'light' | 'auto' = 'auto';

  @property({type: String, reflect: true, attribute: true})
  theme: 'ios' | 'unstyled' = 'unstyled'; // 目前不支持 'md'

  private __colorSchemeFlow = flowColorScheme(this);
  get isDark() {
    return (
      (this.colorScheme === 'auto'
        ? this.__colorSchemeFlow.value
        : this.colorScheme) === 'dark'
    );
  }

  // override disconnectedCallback(): void {
  //   super.disconnectedCallback();
  //   this.__headerEleEffectOff();
  // }
  @property({
    type: String,
    reflect: true,
    attribute: true,
  })
  pageTitle = '';

  private __scrollbarOverlayFlow = flowScrollbarOverlay(this);
  override render() {
    this.dataset.colorScheme = this.isDark ? 'dark' : 'light';

    return html`
      <style>
        :host {
          --page-header-height: ${this.__headerHeight}px;
          --page-footer-height: ${this.__footerHeight}px;
        }
        /* 在移动端，scrollbar是overlay的，这里默认提供了0.5em的padding，来让 */
        .scrollable {
          --_scrollbar-base: ${this.__scrollbarOverlayFlow.value
            ? '0.5em'
            : '0px'};
        }
      </style>
      <dialog open=${this.open} part="layer">
        <appn-scroll-view class="root" part="root">
          <div
            class="header toolbar stuck-top"
            part="header"
            ${this.__headerSize.observe()}
          >
            <slot name="header">
              <appn-header>${this.pageTitle}</appn-header>
            </slot>
          </div>
          <div class="body" part="body">
            <slot></slot>
          </div>
          <div
            class="footer toolbar"
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
    'appn-page': AppnPage;
  }
}
