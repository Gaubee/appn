import {iter_get_first_or_null, map_get_or_put} from '@gaubee/util';
import {createContext} from '@lit/context';
import type {Property} from 'csstype';
export interface AppnTheme {
  name: Appn.ThemeName;
  /**
   * 一些风格化的标签，某些组件会基于这些风格化来做扩展，
   *
   * - 同html-class的优先级规则，越往后优先级越高。因此如果同时写了 "dark","light"，那么会认作 "light"
   * - 如果开发者想要扩展自己的class，可以通过 `declare global { namespace Appn { interface iThemeClass {` 中补充字段
   */
  class: Appn.ThemeClass[];
  /**
   * 网格单元大小
   *
   * 通常用于：
   * - 留白（边距、元素间隔）
   * - 圆角
   * - 小图标
   */
  gridUnit: string;
  /**
   * 参考文献：
   * @see {@link https://drafts.csswg.org/css-color/#css-system-colors}
   */
  colors: {
    Canvas: string;
    CanvasText: string;
    Accent: string;
    AccentText: string;
    Red: string;
    Orange: string;
    Yellow: string;
    Green: string;
    Mint: string;
    Teal: string;
    Cyan: string;
    Blue: string;
    Indigo: string;
    Purple: string;
    Pink: string;
    Brown: string;
    [key: string & {}]: string;
  };
  safeAreaInset: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  font: {
    style: Property.FontStyle;
    variantLigatures: Property.FontVariantLigatures;
    variantCaps: Property.FontVariantCaps;
    variantNumeric: Property.FontVariantNumeric;
    variantEastAsian: Property.FontVariantEastAsian;
    variantAlternates: Property.FontVariantAlternates;
    variantPosition: Property.FontVariantPosition;
    variantEmoji: Property.FontVariantEmoji;
    weight: Property.FontWeight;
    stretch: Property.FontStretch;
    size: Property.FontSize;
    family: Property.FontFamily;
    opticalSizing: Property.FontOpticalSizing;
    sizeAdjust: Property.FontSizeAdjust;
    kerning: Property.FontKerning;
    featureSettings: Property.FontFeatureSettings;
    variationSettings: Property.FontVariationSettings;
    lineHeight: Property.LineHeight;
  };
  transition: Record<
    'common' | 'page' | 'menu' | ({} & string),
    | {
        enter: CssTransitionConfig;
        leave: CssTransitionConfig;
      }
    | CssTransitionConfig
  >;
}
interface CssTransitionConfig {
  ease: Property.TransitionTimingFunction;
  duration: Property.TransitionDuration;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type AppnThemePartial = DeepPartial<AppnTheme>;

import {merge} from 'ts-deepmerge';

/**
 * 混合theme，遵循后来者居上的优先级
 *
 * 混合规则：
 * 1. undefined 的值不会被采用
 * 2. array 不混发生混合。所以像class这种数组对象，只会采取最后一个theme的值
 * @param base
 * @param exts
 * @returns
 */
export const appnThemeMixin = (base: AppnTheme, ...exts: AppnThemePartial[]) => {
  return merge.withOptions({mergeArrays: false, allowUndefinedOverrides: false}, base, ...exts) as AppnTheme;
};

/**
 * 全局的类型暴露，方便某些情况下，需要取得具体的theme类型。
 * 这样对于一些扩展来说有帮助
 */
declare global {
  namespace Appn {
    interface iThemeClass {
      /// 风格
      /** 范指 ios-lick 风格 */
      ios: 'ios/ipados theme';
      /** 范指 material3 风格 */
      md: 'material3 design';
      /** 范指无风格，接近于HTML原生标准的样式 */
      unstyled: 'native html style';

      /// 颜色偏好
      /** 范指亮色 */
      light: 'prefers-color-scheme: light';
      /** 范指暗色 */
      dark: 'prefers-color-scheme: dark';

      /// 辅助
      /** 视觉障碍 */
      accessible: 'better accessibilityProvide a better experience for people with visual impairments';
    }
    type ThemeClass = keyof iThemeClass;
    type MaybeThemeClass = ThemeClass | (string & {});
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface iTheme {}
    type ThemeName = keyof iTheme;
  }
}
export const appnThemeContext = createContext<AppnTheme | undefined>(Symbol('appn-theme'));
const allAppnThemes = new Map<Appn.MaybeThemeClass, Set<AppnTheme>>();
/**
 * 获取所有的主题
 * @returns
 */
export const getAllAppnThemes = () => [...new Set([...allAppnThemes.values()].map((themes) => [...themes]).flat())];
/**
 * 注册主题
 * @param themes
 */
export const registerAppnTheme = (...themes: AppnTheme[]) => {
  for (const theme of themes) {
    for (const className of theme.class) {
      const themes = map_get_or_put(allAppnThemes, className, () => new Set());
      themes.add(theme);
    }
  }
};
/**
 * 查询主题
 * @param prefersClass
 * @returns
 */
export const findAppnTheme = (prefersClass: Appn.MaybeThemeClass[]) => {
  let founds: Set<AppnTheme> | undefined;
  for (const className of prefersClass) {
    const themes = allAppnThemes.get(className);
    if (themes == null || themes.size === 0) {
      continue;
    }
    if (null == founds) {
      founds = themes;
      continue;
    }

    /// 如果有交集，那么采用交集，否则跳过这个className，使用下一个className继续寻找
    const both = themes.intersection(founds);
    if (both.size === 0) {
      continue;
    } else {
      founds = both;
    }
  }
  return founds ? iter_get_first_or_null(founds) : undefined;
};
