import {createContext} from '@lit/context';

export interface AppnTheme {
  name: Appn.ThemeName;
  /** 一些风格化的标签，某些组件会基于这些风格化来做扩展 */
  class: Appn.ThemeClass[];
  gridUnit: number;
  colors: {
    Canvas: string;
    CanvasText: string;
    AccentColor: string;
    AccentColorText: string;
  };
  safeAreaInset: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

/**
 * 全局的类型暴露，方便某些情况下，需要取得具体的theme类型。
 * 这样对于一些扩展来说有帮助
 */
declare global {
  namespace Appn {
    interface iThemeClass {
      // 风格
      ios: true; // 范指 ios-lick 风格
      md: true; // 范指 material3 风格
      unstyled: true; // 范指无风格，接近于HTML原生标准的样式

      // 颜色偏好
      light: true; // 范指亮色
      dark: true; // 范指暗色
    }
    type ThemeClass = keyof iThemeClass;
    interface iTheme {}
    type ThemeName = keyof iTheme;
  }
}
export const appnThemeContext = createContext<AppnTheme|undefined>('theme');
