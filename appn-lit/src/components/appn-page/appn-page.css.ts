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
  return unsafeCSS(`
        :host([color-scheme='dark'])${cssText}
        @media (prefers-color-scheme: dark) {
          :host([color-scheme='auto'])${cssText}
        }
      `);
};
// const ios = (cssText: string | CSSResult) => {
//   cssText = joinableCssText(cssText);
//   return unsafeCSS(`:host([theme='ios'])${cssText}`);
// };
// const md = (cssText: string | CSSResult) => {
//   cssText = joinableCssText(cssText);
//   return unsafeCSS(`:host([theme='md'])${cssText}`);
// };

export const styles = css`
  :host {
    display: contents;
    --safe-area-inset-top: env(safe-area-inset-top);
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    --safe-area-inset-left: env(safe-area-inset-left);
    --safe-area-inset-right: env(safe-area-inset-right);
  }
  dialog {
    margin: 0;
    border: 0;
    padding: 0;
    width: fit-content;
    height: fit-content;
    overflow: hidden;

    color: #333;
    background-color: #fafafa;
    box-sizing: border-box;
    box-shadow: 0 0 2px -1px #000;
  }
  ${dark(css`
    dialog {
      color: #fff;
      background-color: #333;
    }
  `)}

  :host([mode='block']) dialog {
    position: relative;
  }

  :host([mode='screen']) dialog {
    width: 100%;
    height: 100%;
  }

  :host([mode='screen']) dialog::backdrop {
    background-color: #21212133;
  }
  ${dark(css`
    :host([mode='screen']) dialog::backdrop {
      background-color: #fff9;
    }
  `)}

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
    scrollbar-color: #0003 transparent;
  }

  ${dark(css`
    .scrollable {
      scrollbar-color: #fff9 transparent;
    }
  `)}

  .header {
    grid-area: 1 / 1 / 2 / 2;
    z-index: 3;
    position: sticky;
    top: 0;
    padding-top: var(--safe-area-inset-top);
  }
  .translucent {
    backdrop-filter: blur(20px) contrast(0.5) brightness(1.5);
  }
  ${dark(css`
    .translucent {
      backdrop-filter: blur(20px) contrast(0.5) brightness(0.5);
    }
  `)}

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
