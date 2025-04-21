/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {func_remember, obj_props} from '@gaubee/util';
import {provide} from '@lit/context';
import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {getAdoptedStyleSheets} from '../../utils/css-helper';
import {cssLiteral} from '../../utils/lit-helper';
import {colorSchemeStateify} from '../../utils/match-media-signal/color-scheme-stateify';
import {effect_state} from '../../utils/signals';
import {appnThemeContext, findAppnTheme, getAllAppnThemes, registerAppnTheme, type AppnTheme} from './appn-theme-context';
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
  @effect_state()
  accessor #colorSchemeState = colorSchemeStateify();
  private get __colorSchemeResult() {
    return this.colorScheme === 'auto' ? this.#colorSchemeState.get() : this.colorScheme;
  }

  get isDark(): boolean {
    return this.__colorSchemeResult === 'dark';
  }

  /**
   * 是否启用视觉可访问性的增强，会在查询theme的时候，自动添加 accessible 查询条件
   */
  @property({type: Boolean, reflect: true, attribute: true})
  accessor accessible = false;

  private __findThemeContext = func_remember(
    (colorScheme: string) => {
      const prefersClass: Appn.MaybeThemeClass[] = [
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
  accessor #themeContext: AppnTheme = this.__findThemeContext(this.__colorSchemeResult) ?? unstyledLightTheme;
  get themeContext() {
    return this.#themeContext;
  }

  private __transitionStyleSheet = func_remember(
    (cssText: string) => {
      const css = new CSSStyleSheet();
      css.replaceSync(cssText);
      return css;
    },
    (cssText) => cssText
  );

  override render() {
    const colorScheme = this.isDark ? 'dark' : 'light';
    this.dataset.colorScheme = colorScheme;

    const themeContext = (this.#themeContext = this.__findThemeContext(colorScheme) ?? this.#themeContext);
    this.dataset.theme = themeContext.name;

    const {font, colors, safeAreaInset, transition} = themeContext;

    let transitionCss = '';
    for (const key of obj_props(transition)) {
      const tran = transition[key];

      const enter = 'enter' in tran ? tran.enter : tran;
      const leave = 'leave' in tran ? tran.leave : tran;
      transitionCss += `--${key}-enter-ease:${enter.ease};--${key}-enter-duration:${enter.duration};--${key}-leave-ease:${leave};--${key}-leave-duration:${leave.duration};`;
    }
    if (transitionCss) {
      transitionCss = `:host{${transitionCss}}`;
    }
    const transitionStyleSheet = this.__transitionStyleSheet(transitionCss);
    const ass = getAdoptedStyleSheets(this.shadowRoot!);
    ass.set('transition', transitionStyleSheet);
    css`
      :host {
        --font-style: ${cssLiteral(font.style)};
        --font-variant-ligatures: ${cssLiteral(font.variantLigatures)};
        --font-variant-caps: ${cssLiteral(font.variantCaps)};
        --font-variant-numeric: ${cssLiteral(font.variantNumeric)};
        --font-variant-east-asian: ${cssLiteral(font.variantEastAsian)};
        --font-variant-alternates: ${cssLiteral(font.variantAlternates)};
        --font-variant-position: ${cssLiteral(font.variantPosition)};
        --font-variant-emoji: ${cssLiteral(font.variantEmoji)};
        --font-weight: ${cssLiteral(font.weight)};
        --font-stretch: ${cssLiteral(font.stretch)};
        --font-size: ${cssLiteral(font.size)};
        --font-family: ${cssLiteral(font.family)};
        --font-optical-sizing: ${cssLiteral(font.opticalSizing)};
        --font-size-adjust: ${cssLiteral(font.sizeAdjust)};
        --font-kerning: ${cssLiteral(font.kerning)};
        --font-feature-settings: ${cssLiteral(font.featureSettings)};
        --font-variation-settings: ${cssLiteral(font.variationSettings)};
        --line-height: ${cssLiteral(font.lineHeight)};

        --color-canvas: ${cssLiteral(colors.Canvas)};
        --color-canvas-text: ${cssLiteral(colors.CanvasText)};
        --color-accent: ${cssLiteral(colors.Accent)};
        --color-accent-text: ${cssLiteral(colors.AccentText)};
        --color-red: ${cssLiteral(colors.Red)};
        --color-orange: ${cssLiteral(colors.Orange)};
        --color-yellow: ${cssLiteral(colors.Yellow)};
        --color-green: ${cssLiteral(colors.Green)};
        --color-mint: ${cssLiteral(colors.Mint)};
        --color-teal: ${cssLiteral(colors.Teal)};
        --color-cyan: ${cssLiteral(colors.Cyan)};
        --color-blue: ${cssLiteral(colors.Blue)};
        --color-indigo: ${cssLiteral(colors.Indigo)};
        --color-purple: ${cssLiteral(colors.Purple)};
        --color-pink: ${cssLiteral(colors.Pink)};
        --color-brown: ${cssLiteral(colors.Brown)};

        --grid-unit: ${cssLiteral(themeContext.gridUnit)};
        --grid-unit-0.5: calc(var(--grid-unit) / 2);
        --grid-unit-2: calc(var(--grid-unit) * 2);
        --grid-unit-3: calc(var(--grid-unit) * 3);
        --grid-unit-4: calc(var(--grid-unit) * 4);

        --safe-area-inset-top: ${cssLiteral(safeAreaInset.top)};
        --safe-area-inset-bottom: ${cssLiteral(safeAreaInset.bottom)};
        --safe-area-inset-left: ${cssLiteral(safeAreaInset.left)};
        --safe-area-inset-right: ${cssLiteral(safeAreaInset.right)};
      }
    `;
    return html`<style>
        ${css`
          :host {
            --font-style: ${cssLiteral(font.style)};
            --font-variant-ligatures: ${cssLiteral(font.variantLigatures)};
            --font-variant-caps: ${cssLiteral(font.variantCaps)};
            --font-variant-numeric: ${cssLiteral(font.variantNumeric)};
            --font-variant-east-asian: ${cssLiteral(font.variantEastAsian)};
            --font-variant-alternates: ${cssLiteral(font.variantAlternates)};
            --font-variant-position: ${cssLiteral(font.variantPosition)};
            --font-variant-emoji: ${cssLiteral(font.variantEmoji)};
            --font-weight: ${cssLiteral(font.weight)};
            --font-stretch: ${cssLiteral(font.stretch)};
            --font-size: ${cssLiteral(font.size)};
            --font-family: ${cssLiteral(font.family)};
            --font-optical-sizing: ${cssLiteral(font.opticalSizing)};
            --font-size-adjust: ${cssLiteral(font.sizeAdjust)};
            --font-kerning: ${cssLiteral(font.kerning)};
            --font-feature-settings: ${cssLiteral(font.featureSettings)};
            --font-variation-settings: ${cssLiteral(font.variationSettings)};
            --line-height: ${cssLiteral(font.lineHeight)};

            --color-canvas: ${cssLiteral(colors.Canvas)};
            --color-canvas-text: ${cssLiteral(colors.CanvasText)};
            --color-accent: ${cssLiteral(colors.Accent)};
            --color-accent-text: ${cssLiteral(colors.AccentText)};
            --color-red: ${cssLiteral(colors.Red)};
            --color-orange: ${cssLiteral(colors.Orange)};
            --color-yellow: ${cssLiteral(colors.Yellow)};
            --color-green: ${cssLiteral(colors.Green)};
            --color-mint: ${cssLiteral(colors.Mint)};
            --color-teal: ${cssLiteral(colors.Teal)};
            --color-cyan: ${cssLiteral(colors.Cyan)};
            --color-blue: ${cssLiteral(colors.Blue)};
            --color-indigo: ${cssLiteral(colors.Indigo)};
            --color-purple: ${cssLiteral(colors.Purple)};
            --color-pink: ${cssLiteral(colors.Pink)};
            --color-brown: ${cssLiteral(colors.Brown)};

            --grid-unit: ${cssLiteral(themeContext.gridUnit)};
            --grid-unit-0.5: calc(var(--grid-unit) / 2);
            --grid-unit-2: calc(var(--grid-unit) * 2);
            --grid-unit-3: calc(var(--grid-unit) * 3);
            --grid-unit-4: calc(var(--grid-unit) * 4);

            --safe-area-inset-top: ${cssLiteral(safeAreaInset.top)};
            --safe-area-inset-bottom: ${cssLiteral(safeAreaInset.bottom)};
            --safe-area-inset-left: ${cssLiteral(safeAreaInset.left)};
            --safe-area-inset-right: ${cssLiteral(safeAreaInset.right)};
          }`}${transitionStyleSheet}
      </style>
      <slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-theme-provider': AppnThemeProviderElement;
  }
}
