import {css, type CSSResult, unsafeCSS} from 'lit';
import {appnViewWithAppnPageStyle} from '../appn-view/with-appn-page.css';

const joinableCssText = (cssText: string | CSSResult) => {
  cssText = cssText.toString().trim();
  if (false === cssText.startsWith(':host')) {
    cssText = ' ' + cssText;
  }
  return cssText;
};

const dark = (cssText: string | CSSResult) => {
  cssText = joinableCssText(cssText);
  return unsafeCSS(
    `:host([data-color-scheme='dark'])${joinableCssText(cssText)}`
  );
  // return unsafeCSS(onlyDark(cssText).cssText + systemDark(cssText));
};
// const onlyDark = (cssText: string | CSSResult) =>
//   unsafeCSS(`:host([color-scheme='dark'])${joinableCssText(cssText)}`);
// const systemDark = (cssText: string | CSSResult) =>
//   unsafeCSS(
//     `@media (prefers-color-scheme: dark){:host([color-scheme='auto'])${joinableCssText(cssText)}}`
//   );
const light = (cssText: string | CSSResult) => {
  cssText = joinableCssText(cssText);
  return unsafeCSS(
    `:host([data-color-scheme='light'])${joinableCssText(cssText)}`
  );
  // return unsafeCSS(onlyLight(cssText).cssText + systemLight(cssText));
};
// const onlyLight = (cssText: string | CSSResult) =>
//   unsafeCSS(`:host([color-scheme='light'])${joinableCssText(cssText)}`);
// const systemLight = (cssText: string | CSSResult) =>
//   unsafeCSS(
//     `@media (prefers-color-scheme: light){:host([color-scheme='auto'])${joinableCssText(cssText)}}`
//   );
// //@ts-ignore
// const ios = (cssText: string | CSSResult) => {
//   cssText = joinableCssText(cssText);
//   return unsafeCSS(`:host([theme='ios'])${cssText}`);
// };
// //@ts-ignore
// const md = (cssText: string | CSSResult) => {
//   cssText = joinableCssText(cssText);
//   return unsafeCSS(`:host([theme='md'])${cssText}`);
// };
// //@ts-ignore
// const unstyled = (cssText: string | CSSResult) => {
//   cssText = joinableCssText(cssText);
//   return unsafeCSS(`:host([theme='unstyled'])${cssText}`);
// };

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
CSS.registerProperty({
  name: '--grid-unit',
  syntax: '<length>',
  inherits: true,
  initialValue: '8px',
});
export const styles = [
  css`
    @supports not (color: AccentColor) {
      :host {
        --system-color-accent-color: #2e75ff;
        --system-color-accent-color-text: #fff;
      }
    }
    :host {
      display: contents;
      --safe-area-inset-top: env(safe-area-inset-top);
      --safe-area-inset-bottom: env(safe-area-inset-bottom);

      /**左右默认提供1个网格的大小 */
      --safe-area-inset-left: var(--grid-unit);
      --safe-area-inset-left: max(
        env(safe-area-inset-left, var(--grid-unit)),
        var(--grid-unit)
      );
      --safe-area-inset-right: var(--grid-unit);
      --safe-area-inset-right: max(
        env(safe-area-inset-left, var(--grid-unit)),
        var(--grid-unit)
      );
      font-family: var(--appn-font-family, sans-serif);
    }
    /** 参考文献：https://drafts.csswg.org/css-color/#css-system-colors */
    ${light(css`
      :host {
        --system-color-canvas: #fff;
        --system-color-canvas-text: #000;
        --color-scheme-light: 1;
        --color-scheme-dark: 0;
      }
    `)}
    ${dark(css`
      :host {
        --system-color-canvas: #000;
        --system-color-canvas-text: #fff;
        --color-scheme-light: 0;
        --color-scheme-dark: 1;
      }
    `)}

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
      /* scrollbar-gutter: stable both-edges; */
      scrollbar-width: none;
      scrollbar-color: var(--system-color-canvas-text) transparent;
      scrollbar-color: color-mix(
          in hsl,
          var(--system-color-canvas-text),
          transparent 75.3%
        )
        transparent;
      position: absolute;
    }
    /* .scrollable::-webkit-scrollbar {
    display: none;
  } */
    .scrollable::after {
      content: ' ';
      overflow: scroll;
      position: absolute;
      width: 10px;
      height: 100%;
      right: 0;
      top: 0;
    }
    .header {
      width: 100cqw;
      grid-area: 1 / 1 / 2 / 2;
      z-index: 3;
      position: sticky;
      top: 0;
    }

    .body {
      width: 100cqw;
      grid-area: 1 / 1 / 4 / 2;
      z-index: 1;
      /* --_pt: var(--page-header-height);
    --_pb: var(--page-footer-height); */

      /* padding-top: var(--_pt);
    scroll-padding-top: var(--_pt); */
      /* margin-top: calc(var(--_pb) * -1);
    padding-bottom: var(--_pb);
    scroll-padding-bottom: var(--_pb); */

      /** 在桌面端，page-padding-line 使用 scrollbar: both-edges 来提供支撑 */
      /** 在桌面端，page-padding-line 使用 max(safe-area-inset, 0.5em) 来提供支撑 */
      /* --_pl: max(var(--safe-area-inset-left), var(--_scrollbar-base, 8px));
    --_pr: max(var(--safe-area-inset-right), var(--_scrollbar-base, 8px)); */
      /* padding-left: var(--_pl);
    padding-right: var(--_pr);
    scroll-padding-left: var(--_pl);
    scroll-padding-right: var(--_pr); */

      box-sizing: border-box;
    }

    .footer {
      width: 100cqw;
      grid-area: 3 / 1 / 4 / 2;
      z-index: 2;
      position: sticky;
      /* top: calc(100% - var(--page-footer-height)); */
      bottom: 0;
    }
    ::slotted(*) {
      /* 3D加速可以顺便解决 scrollbar: both-edges 带来的边缘裁切的BUG */
      transform: translateZ(0);
    }

    /* .stuck-top {
    container-type: scroll-state;
    appn-header,
    ::slotted([slot='header']) {
      transition-duration: 500ms;
      transition-timing-function: ease-out;
      @container scroll-state(stuck: top) {
        background-color: #0f03;
      }
    }
  }
  .stuck-bottom {
    container-type: scroll-state;
    appn-footer,
    ::slotted([slot='footer']) {
      transition-duration: 500ms;
      transition-timing-function: ease-out;
      @container scroll-state(stuck: bottom) {
        background-color: #0f03;
      }
    }
  } */
  `,
  appnViewWithAppnPageStyle,
];
