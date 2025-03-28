import { obj_props } from '@gaubee/util';
import { appnThemeMixin, type AppnTheme, type AppnThemePartial } from './appn-theme-context';
import { unstyledDarkTheme, unstyledLightTheme } from './unstyled-theme';

const iosBaseTheme = {
  gridUnit: '8px',
  safeAreaInset: {
    /// 左右默认提供1个网格的大小
    bottom: `max(env(safe-area-inset-left, var(--grid-unit)), var(--grid-unit))`,
    left: `max(env(safe-area-inset-left, var(--grid-unit)), var(--grid-unit))`,
  },
  font: {
    family: [
      /// 英文字体优先链
      '-apple-system' /* 系统自动调用 San Francisco (iOS/macOS) */,
      'BlinkMacSystemFont' /* Chrome 的 San Francisco 回退方案 */,
      "'Helvetica Neue'" /* iOS 7-8 及旧版 macOS 回退 */,
      "'Segoe UI'" /* Windows 系统适配 */,

      /// 中文字体优先链
      "'PingFang SC'" /* 苹方简体 (iOS 9+) */,
      "'HarmonyOS Sans SC'" /* 华为鸿蒙字体 */,
      "'HONOR Sans SC'" /* 荣耀字体 */,
      'MiSans' /* 小米字体 */,
      "'Source Han Sans SC'" /* 思源黑体 */,
      "'Hiragino Sans GB'" /* 冬青黑体 (旧版 macOS 中文回退) */,
      "'Microsoft YaHei'" /* 微软雅黑 (Windows 中文适配) */,
      'sans-serif' /* 通用无衬线兜底 */,
    ].join(' '),
  },
} satisfies AppnThemePartial;

/**
 * @see {@link https://developer.apple.com/design/human-interface-guidelines/color/#iOS-iPadOS-system-colors}
 */
const iosNamedColor = {
  Red: ['#ff3b30', '#ff453a', '#d70015', '#ff6961'],
  Orange: ['#ff9500', '#ff9f0a', '#c93400', '#ffb340'],
  Yellow: ['#ffcc00', '#ffd60a', '#b25000', '#ffd426'],
  Green: ['#34c759', '#30d158', '#248a3d', '#30db5b'],
  Mint: ['#00c7be', '#66d4cf', '#0c817b', '#66d4cf'],
  Teal: ['#30b0c7', '#40c8e0', '#008299', '#5de6ff'],
  Cyan: ['#32ade6', '#64d2ff', '#0071a4', '#70d7ff'],
  Blue: ['#007aff', '#0a84ff', '#0040dd', '#409cff'],
  Indigo: ['#5856d6', '#5e5ce6', '#3634a3', '#7d7aff'],
  Purple: ['#af52de', '#bf5af2', '#8944ab', '#da8fff'],
  Pink: ['#ff2d55', '#ff375f', '#d30f45', '#ff6482'],
  Brown: ['#a5845e', '#ac8e68', '#7f6545', '#b59469'],
};
const pickNamedColor = (at: number) => {
  const res = {} as {[K in keyof typeof iosNamedColor]: string};
  for (const key of obj_props(iosNamedColor)) {
    res[key] = iosNamedColor[key][at];
  }
  return res;
};

export const iosLightTheme = appnThemeMixin(unstyledLightTheme, iosBaseTheme, {
  name: 'ios-light',
  class: ['ios', 'light'],
  colors: {
    CanvasText: '#1d1d1f',
    ...pickNamedColor(0),
  },
});
export const iosDarkTheme = appnThemeMixin(unstyledDarkTheme, iosBaseTheme, {
  name: 'ios-dark',
  class: ['ios', 'dark'],
  colors: {
    Canvas: '#1c1c1e',
    ...pickNamedColor(1),
  },
}) satisfies AppnTheme;

export const iosAccessibleLightTheme = appnThemeMixin(iosLightTheme, {
  name: 'ios-light-accessible',
  class: ['ios', 'light', 'accessible'],
  colors: {
    ...pickNamedColor(2),
  },
});
export const iosAccessibleDarkTheme = appnThemeMixin(iosDarkTheme, {
  name: 'ios-dark-accessible',
  class: ['ios', 'dark', 'accessible'],
  colors: {
    ...pickNamedColor(3),
  },
});

/// 注册全局类型
declare global {
  namespace Appn {
    interface iThemeClass {
      /** 视觉障碍 */
      accessible: 'better accessibilityProvide a better experience for people with visual impairments';
    }
    interface iTheme {
      'ios-light': typeof iosLightTheme;
      'ios-dark': typeof iosDarkTheme;
      'ios-light-accessible': typeof iosAccessibleLightTheme;
      'ios-dark-accessible': typeof iosAccessibleDarkTheme;
    }
  }
}
