/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */

import {func_remember, obj_props} from '@gaubee/util';
import {provide} from '@lit/context';
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {getAdoptedStyleSheets} from '../../utils/css-helper';
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
  static {
    const notoSansLink = document.createElement('link');
    notoSansLink.rel = 'stylesheet';
    notoSansLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap';
    document.head.appendChild(notoSansLink);
  }
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

  private __themeStyleSheet = func_remember(
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
    const tag = this.tagName;
    if (transitionCss) {
      transitionCss = `${tag}{${transitionCss}}`;
    }
    const css = String.raw;
    const themeStyleSheet = this.__themeStyleSheet(
      transitionCss +
        css`
          ${tag} {
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
            --grid-unit-0\.5: calc(var(--grid-unit) / 2);
            --grid-unit-2: calc(var(--grid-unit) * 2);
            --grid-unit-3: calc(var(--grid-unit) * 3);
            --grid-unit-4: calc(var(--grid-unit) * 4);

            --safe-area-inset-top: ${safeAreaInset.top};
            --safe-area-inset-bottom: ${safeAreaInset.bottom};
            --safe-area-inset-left: ${safeAreaInset.left};
            --safe-area-inset-right: ${safeAreaInset.right};
          }
        `
    );
    const ass = getAdoptedStyleSheets(this.shadowRoot!.host);
    ass.set('appn-theme', themeStyleSheet);

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-theme-provider': AppnThemeProviderElement;
  }
}
