import {iter_map_not_null} from '@gaubee/util';
import {css} from 'lit';
CSS.registerProperty({
  name: '--translate-x',
  syntax: '<length-percentage>',
  inherits: false,
  initialValue: `0px`,
});
CSS.registerProperty({
  name: '--translate-y',
  syntax: '<length-percentage>',
  inherits: false,
  initialValue: `0px`,
});

CSS.registerProperty({
  name: '--page-scale-x',
  syntax: '<percentage>',
  inherits: false,
  initialValue: `100%`,
});

CSS.registerProperty({
  name: '--page-scale-y',
  syntax: '<percentage>',
  inherits: false,
  initialValue: `100%`,
});

export const appnNavigationStyle = css`
  :host {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'stack';
    width: 100cqw;
    height: 100cqh;
    overflow: hidden;
    background-color: var(--color-canvas);
  }
  ::slotted(*) {
    grid-area: stack;
    z-index: var(--index, 1);
  }
  slot[name='router'] {
    display: none;
  }

  :host([stack]) {
    /* 基础3D场景设置 */
    perspective: calc(var(--z, 1200) * 1px);
    transform-style: preserve-3d;
    /* 默认使用居中 */
    perspective-origin: calc(var(--x, 50) * 1%) calc(var(--y, 50) * 1%);
  }
  /* 通过属性控制堆叠方向 */
  :host([stack-direction='horizontal']) {
    /** 从上到下 */
    --x: 130;
  }
  :host([stack-direction='vertical']) {
    /** 从左到右 */
    --y: 130;
  }

  ::slotted(*) {
    /* 基础3D变换设置 */
    transform-style: preserve-3d;
    user-select: none;
  }

  /* 动态生成卡片堆叠偏移 */
  ::slotted(*) {
    --translate-z: calc((var(--present-index, -1) - var(--index, 0)) * -36px);
    translate: var(--translate-x, 0) var(--translate-y, 0) var(--translate-z);
    scale: var(--page-scale-x, 100%) var(--page-scale-y, 100%);
  }
`;

export const appnNavigationHistoryEntryStyle = iter_map_not_null(
  [
    css`
      :host {
        /** 充满grid容器 */
        place-self: stretch;
        display: grid;

        transition-property: all;
        transition-behavior: allow-discrete;
      }
    `,
    CSS.supports('view-transition-name: content')
      ? css`
          :host {
            animation-fill-mode: forwards;
          }
          :host([data-tense='present']) {
            animation-duration: var(--page-enter-duration);
            animation-timing-function: var(--page-enter-ease);
          }
          :host([data-from-tense='present']) {
            animation-duration: var(--page-leave-duration);
            animation-timing-function: var(--page-leave-ease);
          }
          @keyframes page-bootstrap {
            from {
              opacity: 0;
              --page-scale-x: 90%;
              --page-scale-y: 90%;
            }
            to {
              opacity: 1;
              --page-scale-x: 100%;
              --page-scale-y: 100%;
            }
          }
          @keyframes page-push-enter {
            from {
              --translate-x: 100%;
            }
            to {
              --translate-x: 0%;
            }
          }
          @keyframes page-push-leave {
            from {
              --translate-x: 0%;
            }
            to {
              --translate-x: -38%;
            }
          }

          @keyframes page-back-enter {
            from {
              --translate-x: -38%;
            }
            to {
              --translate-x: 0%;
            }
          }
          @keyframes page-back-leave {
            from {
              --translate-x: 0%;
            }
            to {
              --translate-x: 100%;
            }
          }

          :host([data-tense='past']) {
            --translate-x: -38%;
            /* display: none; */
          }
          :host([data-tense='present'][data-from-tense='past']) {
            animation-name: page-back-enter;
          }
          :host([data-tense='present'][data-from-tense='future']),
          :host([data-tense='present'][data-from-tense='present']) {
            animation-name: page-push-enter;
          }

          :host([data-from-tense='present'][data-tense='past']) {
            animation-name: page-push-leave;
            /* animation-direction: reverse; */
          }
          :host([data-from-tense='present'][data-tense='future']) {
            animation-name: page-back-leave;
            /* animation-direction: reverse; */
          }

          :host([data-tense='past'][data-from-tense='past']) {
            display: none;
          }
          :host([data-tense='future'][data-from-tense='future']) {
            display: none;
          }
          :host([data-tense='present'][data-index='0']) {
            animation-name: page-bootstrap;
          }
        `
      : css`
          :host([data-from-tense='present']) {
            transition-duration: var(--page-leave-duration);
            transition-timing-function: var(--page-leave-ease);
          }
          :host([data-tense='present']) {
            transition-duration: var(--page-enter-duration);
            transition-timing-function: var(--page-enter-ease);
          }

          :host([data-tense='past']) {
            --translate-x: -38%;
            display: none;
          }
          :host([data-tense='present']) {
            /* Example: Start transparent, fade in */
            --translate-x: 0%;
          }
          :host([data-tense='future']) {
            /* Optionally hide future entries visually if needed beyond display:none */
            --translate-x: 100%;
            display: none;
          }
          :host([data-from-tense='past']) {
            @starting-style {
              --translate-x: -38%;
            }
          }
          :host([data-from-tense='present']) {
            @starting-style {
              --translate-x: 0%;
            }
          }
          :host([data-from-tense='future']) {
            @starting-style {
              --translate-x: 100%;
            }
          }
          :host([data-from-tense='future'][data-index='0']) {
            @starting-style {
              --translate-x: 0%;
              --translate-y: 0%;
              opacity: 0;
            }
          }
        `,
  ],
  (v) => v
);
