import {css} from 'lit';

const scrollbarProperties = [
  {name: '--scrollbar-blur-color', syntax: '<color>', initialValue: '#0001'},
  {name: '--scrollbar-color', syntax: '<color>', initialValue: '#0003'},
  {name: '--scrollbar-hover-color', syntax: '<color>', initialValue: '#0006'},
  {name: '--scrollbar-size', syntax: '<length>', initialValue: '6px'},
];
for (const pro of scrollbarProperties) {
  CSS.registerProperty({
    ...pro,
    inherits: true,
  });
}

export const appnScrollViewStyle = css`
  @media (prefers-color-scheme: dark) {
    :host {
      --scrollbar-blur-color: #fff1;
      --scrollbar-color: #fff3;
      --scrollbar-hover-color: #fff6;
    }
  }

  :host(:not(:hover):not(:focus-within)) {
    --scrollbar-color: var(--scrollbar-blur-color);
  }

  :host {
    display: block;
    position: relative;
    overflow: scroll;
    scroll-behavior: smooth;
    container-type: size;
    container-type: size scroll-state;
    container-name: scrollview;
  }
  .content {
    width: max-content;
    height: max-content;
    z-index: 1;
    position: relative;
    /* 渲染成独立的层 */
    transform: translateZ(0);
  }
  .scrollbar-sticky {
    position: sticky;
    z-index: 2;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    /* 原生滚动条不会被影响 */
    pointer-events: none;
  }
  .scrollbar-wrapper {
    width: var(--view-width);
    height: var(--view-height);
    position: relative;
  }
  .scrollbar {
    /** 这里禁用平滑滚动 */
    scroll-behavior: auto;

    -ms-overflow-style: auto;
    position: absolute;
    pointer-events: all;
  }
  .axis-y {
    overflow-x: clip;
    overflow-y: auto;
    right: 0;
    top: 0;
    width: var(--scrollbar-track-size);
    height: calc(100% - var(--scrollbar-track-size)); /* 为 corner 预留位置 */
  }
  .axis-x {
    overflow-x: auto;
    overflow-y: clip;
    left: 0;
    bottom: 0;
    height: var(--scrollbar-track-size);
    width: calc(100% - var(--scrollbar-track-size)); /* 为 corner 预留位置 */
  }
`;
