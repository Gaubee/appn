import {appnThemeMixin, type AppnTheme} from './appn-theme-context';

export const unstyledLightTheme = {
  name: 'unstyled-light',
  class: ['unstyled', 'light'],
  gridUnit: '4px',
  colors: {
    Canvas: '#ffffff',
    CanvasText: '#000000',
    /// 如果支持，就使用原生的 AccentColor
    ...(CSS.supports('color: AccentColor')
      ? {
          Accent: 'AccentColor',
          AccentText: 'AccentColorText',
        }
      : {
          Accent: '#2e75ff',
          AccentText: '#ffffff',
        }),
    Red: 'red',
    Orange: 'orange',
    Yellow: 'yellow',
    Green: 'green',
    Mint: 'darkturquoise',
    Teal: 'teal',
    Cyan: 'cyan',
    Blue: 'blue',
    Indigo: 'indigo',
    Purple: 'purple',
    Pink: 'pink',
    Brown: 'brown',
  },
  safeAreaInset: {
    top: `env(safe-area-inset-top)`,
    right: `env(safe-area-inset-right)`,
    bottom: `env(safe-area-inset-bottom)`,
    left: `env(safe-area-inset-left)`,
  },
  font: {
    style: 'initial',
    variantLigatures: 'initial',
    variantCaps: 'initial',
    variantNumeric: 'initial',
    variantEastAsian: 'initial',
    variantAlternates: 'initial',
    variantPosition: 'initial',
    variantEmoji: 'initial',
    weight: 'initial',
    stretch: 'initial',
    size: 'initial',
    family: 'initial',
    opticalSizing: 'initial',
    sizeAdjust: 'initial',
    kerning: 'initial',
    featureSettings: 'initial',
    variationSettings: 'initial',
    lineHeight: 'initial',
  },
} satisfies AppnTheme;
debugger
export const unstyledDarkTheme = appnThemeMixin(unstyledLightTheme, {
  name: 'unstyled-dark',
  class: ['unstyled', 'dark'],
  colors: {
    Canvas: '#000000',
    CanvasText: '#ffffff',
  },
});

/// 注册全局类型
declare global {
  namespace Appn {
    interface iTheme {
      'unstyled-light': typeof unstyledLightTheme;
      'unstyled-dark': typeof unstyledDarkTheme;
    }
  }
}
