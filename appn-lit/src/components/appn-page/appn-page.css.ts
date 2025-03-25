import {css, type CSSResult, unsafeCSS} from 'lit';

const joinableCssText = (cssText: string | CSSResult) => {
  cssText = cssText.toString().trim();
  if (false === cssText.startsWith(':host')) {
    cssText = ' ' + cssText;
  }
  return cssText;
};

const dark = (cssText: string | CSSResult) => {
  cssText = joinableCssText(cssText);
  return unsafeCSS(onlyDark(cssText).cssText + systemDark(cssText));
};
const onlyDark = (cssText: string | CSSResult) =>
  unsafeCSS(`:host([color-scheme='dark'])${joinableCssText(cssText)}`);
const systemDark = (cssText: string | CSSResult) =>
  unsafeCSS(
    `@media (prefers-color-scheme: dark){:host([color-scheme='auto'])${joinableCssText(cssText)}}`
  );
const light = (cssText: string | CSSResult) => {
  cssText = joinableCssText(cssText);
  return unsafeCSS(onlyLight(cssText).cssText + systemLight(cssText));
};
const onlyLight = (cssText: string | CSSResult) =>
  unsafeCSS(`:host([color-scheme='light'])${joinableCssText(cssText)}`);
const systemLight = (cssText: string | CSSResult) =>
  unsafeCSS(
    `@media (prefers-color-scheme: light){:host([color-scheme='auto'])${joinableCssText(cssText)}}`
  );
const ios = (cssText: string | CSSResult) => {
  cssText = joinableCssText(cssText);
  return unsafeCSS(`:host([theme='ios'])${cssText}`);
};
//@ts-ignore
const md = (cssText: string | CSSResult) => {
  cssText = joinableCssText(cssText);
  return unsafeCSS(`:host([theme='md'])${cssText}`);
};
//@ts-ignore
const unstyled = (cssText: string | CSSResult) => {
  cssText = joinableCssText(cssText);
  return unsafeCSS(`:host([theme='unstyled'])${cssText}`);
};

for (const pos of ['top', 'right', 'bottom', 'left']) {
  CSS.registerProperty({
    name: `--safe-area-inset-${pos}`,
    syntax: '<length-percentage>',
    inherits: true,
    initialValue: '0px',
  });
}
for (const area of ['header', 'footer']) {
  CSS.registerProperty({
    name: `--page-${area}-height`,
    syntax: '<length-percentage>',
    inherits: true,
    initialValue: `0px`,
  });
}
for (const systemColor of [
  'Canvas',
  'CanvasText',
  'AccentColor',
  'AccentColorText',
]) {
  CSS.registerProperty({
    name: `--system-color-${systemColor.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).slice(1)}`,
    syntax: '<color>',
    inherits: true,
    initialValue: systemColor,
  });
}
export const styles = css`
  :host {
    display: contents;
    --safe-area-inset-top: env(safe-area-inset-top);
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    --safe-area-inset-left: env(safe-area-inset-left);
    --safe-area-inset-right: env(safe-area-inset-right);

    --ios-font-family:
      /* 英文字体优先链 */
      -apple-system /* 系统自动调用 San Francisco (iOS/macOS) */,
      BlinkMacSystemFont /* Chrome 的 San Francisco 回退方案 */,
      'Helvetica Neue' /* iOS 7-8 及旧版 macOS 回退 */,
      'Segoe UI' /* Windows 系统适配 */,
      /* 中文字体优先链 */ 'PingFang SC' /* 苹方简体 (iOS 9+) */,
      'Hiragino Sans GB' /* 冬青黑体 (旧版 macOS 中文回退) */,
      'Microsoft YaHei' /* 微软雅黑 (Windows 中文适配) */,
      sans-serif /* 通用无衬线兜底 */;
  }
  ${ios(css`
    :host {
      font-family: var(--ios-font-family);
    }
  `)}
  ${ios(css`
    ::slotted(*) {
      font-family: var(--ios-font-family);
    }
  `)}
  /** 参考文献：https://drafts.csswg.org/css-color/#css-system-colors */
  ${light(css`
    :host {
      --system-color-canvas: #fff;
      --system-color-canvas-text: #000;
    }
  `)}
  ${light(
    ios(css`
      :host {
        --system-color-canvas-text: #1d1d1f;
      }
    `)
  )}
  ${dark(css`
    :host {
      --system-color-canvas: #000;
      --system-color-canvas-text: #fff;
    }
  `)}
  ${dark(
    ios(css`
      :host {
        --system-color-canvas: #1c1c1e;
      }
    `)
  )}

  dialog {
    margin: 0;
    border: 0;
    padding: 0;
    width: fit-content;
    height: fit-content;
    overflow: hidden;

    color: var(--system-color-canvas-text);
    background-color: var(--system-color-canvas);
    box-sizing: border-box;
    box-shadow: 0 0 2px -1px #000;
  }

  :host([mode='block']) dialog {
    position: relative;
  }

  :host([mode='screen']) dialog {
    width: 100%;
    height: 100%;
  }

  :host([mode='screen']) dialog::backdrop {
    background-color: var(--system-color-canvas-text);
    background-color: color-mix(
      in hsl,
      var(--system-color-canvas-text),
      transparent 80%
    );
  }

  .root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr min-content;
    gap: 0px 0px;
    width: 100%;
    height: 100%;
  }
  .scrollable {
    overflow: auto;
    scroll-behavior: smooth;
    scrollbar-gutter: stable both-edges;
    scrollbar-width: thin; /* 11px */
    scrollbar-color: var(--system-color-canvas-text) transparent;
    scrollbar-color: color-mix(
        in hsl,
        var(--system-color-canvas-text),
        transparent 75.3%
      )
      transparent;
  }

  .header {
    grid-area: 1 / 1 / 2 / 2;
    z-index: 3;
    position: sticky;
    top: 0;
    padding-top: var(--safe-area-inset-top);
  }
  ${ios(css`
    .header {
      font-weight: 600;
    }
  `)}

  ${unstyled(css`
    .toolbar {
      background-color: var(--system-color-canvas);
    }
  `)}
  ${ios(css`
    .toolbar {
      background-color: transparent;
      backdrop-filter: blur(20px) contrast(0.5) brightness(1.5);
    }
  `)}
  ${dark(
    ios(css`
      .toolbar {
        backdrop-filter: blur(20px) contrast(0.5) brightness(0.5);
      }
    `)
  )}

  .body {
    grid-area: 1 / 1 / 4 / 2;
    z-index: 1;
    --_pt: var(--page-header-height);
    --_pb: var(--page-footer-height);

    padding-top: var(--_pt);
    padding-bottom: var(--_pb);
    scroll-padding-top: var(--_pt);
    scroll-padding-bottom: var(--_pb);

    /** 在桌面端，page-padding-line 使用 scrollbar: both-edges 来提供支撑 */
    /** 在桌面端，page-padding-line 使用 max(safe-area-inset, 0.5em) 来提供支撑 */
    --_pl: max(var(--safe-area-inset-left), var(--_scrollbar-base, 0px));
    --_pr: max(var(--safe-area-inset-right), var(--_scrollbar-base, 0px));
    padding-left: var(--_pl);
    padding-right: var(--_pr);
    scroll-padding-left: var(--_pl);
    scroll-padding-right: var(--_pr);
  }

  .footer {
    grid-area: 3 / 1 / 4 / 2;
    z-index: 2;
    position: sticky;
    bottom: 0;
    padding-bottom: var(--safe-area-inset-bottom);
  }
  ::slotted(*) {
    /* 3D加速可以顺便解决 scrollbar: both-edges 带来的边缘裁切的BUG */
    transform: translateZ(0);
  }
`;
