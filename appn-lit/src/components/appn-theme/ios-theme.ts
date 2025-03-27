import type {AppnTheme} from './app-theme-context';

export const unstyledLightTheme = {
  name: 'ios-light',
  class: ['ios', 'light'],
  gridUnit: 8,
  colors: {
    Canvas: '#ffffff',
    CanvasText: '#000000',
    AccentColor: '#000000',
    AccentColorText: '#ffffff',
  },
  safeAreaInset: {
    top: `env(safe-area-inset-top)`,
    right: `env(safe-area-inset-right)`,
    bottom: `env(safe-area-inset-bottom)`,
    left: `env(safe-area-inset-left)`,
  },
} satisfies AppnTheme;

export const iosDarkTheme = {
  name: 'ios-dark',
  class: ['ios', 'dark'],
  gridUnit: 8,
  colors: {
    Canvas: '#ffffff',
    CanvasText: '#000000',
    AccentColor: '#000000',
    AccentColorText: '#ffffff',
  },
  safeAreaInset: {
    top: `env(safe-area-inset-top)`,
    right: `env(safe-area-inset-right)`,
    bottom: `env(safe-area-inset-bottom)`,
    left: `env(safe-area-inset-left)`,
  },
} satisfies AppnTheme;
declare global {
  namespace Appn {
    interface iTheme {
      'ios-light': typeof iosLightTheme;
      'ios-dark': typeof iosDarkTheme;
    }
  }
}
