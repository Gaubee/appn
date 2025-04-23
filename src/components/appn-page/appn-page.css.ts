import {css} from 'lit';
import {appnViewWithAppnPageStyle} from '../appn-view/with-appn-page.css';

for (const area of ['header', 'footer']) {
  CSS.registerProperty({
    name: `--page-${area}-height`,
    syntax: '<length-percentage>',
    inherits: true,
    initialValue: `0px`,
  });
}

export const appnPageStyles = [
  css`
    :host {
      display: block;
      margin: 0;
      border: 0;
      padding: 0;
      width: fit-content;
      height: fit-content;
      overflow: hidden;

      color: var(--color-canvas-text);
      background-color: var(--color-canvas);
      box-sizing: border-box;
      box-shadow: 0 0 2px -1px var(--color-canvas-text);
    }

    :host([mode='block']) {
      position: relative;
    }

    :host([mode='screen']) {
      width: 100%;
      height: 100%;
    }

    :host([mode='screen'])::backdrop {
      background-color: var(--color-canvas-text);
      background-color: color-mix(in hsl, var(--color-canvas-text), transparent 80%);
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
      scrollbar-color: var(--color-canvas-text) transparent;
      scrollbar-color: color-mix(in hsl, var(--color-canvas-text), transparent 75.3%) transparent;
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
      box-sizing: border-box;
    }

    .footer {
      width: 100cqw;
      grid-area: 3 / 1 / 4 / 2;
      z-index: 2;
      position: sticky;
      bottom: 0;
    }
    ::slotted(*) {
      /* 3D加速可以顺便解决 scrollbar: both-edges 带来的边缘裁切的BUG */
      transform: translateZ(0);
    }
  `,
  appnViewWithAppnPageStyle,
];
