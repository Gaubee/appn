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
  transition: {
    common: {
      enter: {
        ease: 'ease-out',
        duration: '0.28s',
      },
      leave: {
        ease: 'ease-in',
        duration: '0.2s',
      },
    },
    /**
     * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/utils/transition/md.transition.ts#L21-L29}
     */
    page: {
      enter: {
        ease: 'cubic-bezier(0.36,0.66,0.04,1)',
        duration: '0.28s',
      },
      leave: {
        ease: 'cubic-bezier(0.47,0,0.745,0.715)',
        duration: '0.2s',
      },
    },
    /**
     * use material-design
     * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/toast/animations/md.enter.ts#L35}
     * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/action-sheet/animations/md.enter.ts#L27}
     * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/menu/menu.tsx#L20-L23}
     */
    toast: {ease: 'cubic-bezier(.36,.66,.04,1)', duration: '0.4s'},
    actionSheet: {ease: 'cubic-bezier(.36,.66,.04,1)', duration: '0.4s'},
    menu: {
      enter: {ease: 'cubic-bezier(0.0,0.0,0.2,1)', duration: '0.28s'},
      leave: {ease: 'cubic-bezier(0.4, 0, 0.6, 1)', duration: '0.2s'},
    },
  },
} satisfies AppnTheme;

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
