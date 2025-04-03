/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {func_remember, obj_props} from '@gaubee/util';
import {provide} from '@lit/context';
import {LitElement, html, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {flowColorScheme} from '../../utils/match-media';
import {appnThemeContext, findAppnTheme, getAllAppnThemes, registerAppnTheme} from './appn-theme-context';
import {appnThemeStyles} from './appn-theme-provider.css';
import {iosAccessibleDarkTheme, iosAccessibleLightTheme, iosDarkTheme, iosLightTheme} from './ios-theme';
import './unstyled-theme';
import {unstyledDarkTheme, unstyledLightTheme} from './unstyled-theme';

/// 将内置的主题注册到内存表
registerAppnTheme(
  // unstyled
  unstyledLightTheme,
  unstyledDarkTheme,
  // ios
  iosLightTheme,
  iosDarkTheme,
  iosAccessibleLightTheme,
  iosAccessibleDarkTheme
  // other...
);

/**
 * 一个用于提供主题的插槽
 * 开发者通过可以在此基础上进行一些定制
 */
@customElement('appn-theme-provider')
export class AppnThemeProviderElement extends LitElement {
  static readonly registerTheme = registerAppnTheme;
  static readonly findTheme = findAppnTheme;
  static get allThemes() {
    return getAllAppnThemes();
  }
  static override styles = appnThemeStyles;

  /**
   * 在通过 registerTheme 接口注册theme后，可以使用 theme 属性来查询对应的 theme
   * 可以同时书写多项：theme="ios dark"
   */
  @property({type: String, reflect: true, attribute: true})
  accessor theme: Appn.MaybeThemeClass = 'unstyled';

  /**
   * 颜色偏好
   * 会在查询 theme 的时候，自动添加 dark/light 查询条件
   */
  @property({type: String, reflect: true, attribute: 'color-scheme'})
  accessor colorScheme: 'dark' | 'light' | 'auto' = 'auto';
  private __colorSchemeFlow = flowColorScheme(this);
  private get __colorSchemeResult() {
    return this.colorScheme === 'auto' ? this.__colorSchemeFlow.value : this.colorScheme;
  }

  get isDark() {
    return this.__colorSchemeResult === 'dark';
  }

  /**
   * 是否启用视觉可访问性的增强，会在查询theme的时候，自动添加 accessible 查询条件
   */
  @property({type: Boolean, reflect: true, attribute: true})
  accessor accessible = false;

  private __findThemeContext = func_remember(
    (colorScheme: string) => {
      const prefersClass: Array<Appn.MaybeThemeClass> = [
        ...this.theme
          .trim()
          .split(/[\s,]+/)
          .filter(Boolean),
        colorScheme,
      ];
      if (this.accessible) {
        prefersClass.push('accessible');
      }
      return findAppnTheme(prefersClass);
    },
    (colorScheme) => this.theme + colorScheme + this.accessible
  );
  @provide({context: appnThemeContext})
  accessor themeContext = this.__findThemeContext(this.__colorSchemeResult) ?? unstyledLightTheme;

  override render() {
    const colorScheme = this.isDark ? 'dark' : 'light';
    this.dataset.colorScheme = colorScheme;

    const themeContext = (this.themeContext = this.__findThemeContext(colorScheme) ?? this.themeContext);
    this.dataset.theme = themeContext.name;

    const {font, colors, safeAreaInset, transition} = themeContext;

    let transitionCss = '';
    for (const key of obj_props(transition)) {
      const tran = transition[key];

      const enter = 'enter' in tran ? tran.enter : tran;
      const leave = 'leave' in tran ? tran.leave : tran;
      transitionCss += `--${key}-enter-ease: ${enter.ease};--${key}-enter-duration: ${enter.duration};--${key}-leave-ease: ${leave};--${key}-leave-duration: ${leave.duration};`;
    }
    if (transitionCss) {
      transitionCss = `:host{${transitionCss}}`;
    }
    return html`<style>
        :host {
          --font-style: ${font.style};
          --font-variant-ligatures: ${font.variantLigatures};
          --font-variant-caps: ${font.variantCaps};
          --font-variant-numeric: ${font.variantNumeric};
          --font-variant-east-asian: ${font.variantEastAsian};
          --font-variant-alternates: ${font.variantAlternates};
          --font-variant-position: ${font.variantPosition};
          --font-variant-emoji: ${font.variantEmoji};
          --font-weight: ${font.weight};
          --font-stretch: ${font.stretch};
          --font-size: ${font.size};
          --font-family: ${font.family};
          --font-optical-sizing: ${font.opticalSizing};
          --font-size-adjust: ${font.sizeAdjust};
          --font-kerning: ${font.kerning};
          --font-feature-settings: ${font.featureSettings};
          --font-variation-settings: ${font.variationSettings};
          --line-height: ${font.lineHeight};

          --color-canvas: ${colors.Canvas};
          --color-canvas-text: ${colors.CanvasText};
          --color-accent: ${colors.Accent};
          --color-accent-text: ${colors.AccentText};
          --color-red: ${colors.Red};
          --color-orange: ${colors.Orange};
          --color-yellow: ${colors.Yellow};
          --color-green: ${colors.Green};
          --color-mint: ${colors.Mint};
          --color-teal: ${colors.Teal};
          --color-cyan: ${colors.Cyan};
          --color-blue: ${colors.Blue};
          --color-indigo: ${colors.Indigo};
          --color-purple: ${colors.Purple};
          --color-pink: ${colors.Pink};
          --color-brown: ${colors.Brown};

          --grid-unit: ${themeContext.gridUnit};
          --grid-unit-0.5: calc(var(--grid-unit) / 2);
          --grid-unit-2: calc(var(--grid-unit) * 2);
          --grid-unit-3: calc(var(--grid-unit) * 3);
          --grid-unit-4: calc(var(--grid-unit) * 4);

          --safe-area-inset-top: ${safeAreaInset.top};
          --safe-area-inset-bottom: ${safeAreaInset.bottom};
          --safe-area-inset-left: ${safeAreaInset.left};
          --safe-area-inset-right: ${safeAreaInset.right};
        }
        ${unsafeCSS(transitionCss)}
      </style>
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-theme-provider': AppnThemeProviderElement;
  }
}
