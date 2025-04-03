import {iter_map_not_null} from '@gaubee/util';
import {css} from 'lit';

export const appnNavigationStyle = css`
  :host {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'stack';
    width: fit-content;
    height: fit-content;
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
  }

  /* 动态生成卡片堆叠偏移 */
  ::slotted(*) {
    --translate-x: 0;
    --translate-y: 0;
    --translate-z: calc((var(--present-index, -1) - var(--index, 0)) * -36px);
    translate: var(--translate-x) var(--translate-y) var(--translate-z);
  }
`;

export const appnNavigationHistoryEntryStyle = iter_map_not_null(
  [
    css`
      :host {
        display: grid;
        width: fit-content;
        height: fit-content;
        transition-property: all;
        transition-behavior: allow-discrete;
        transition-duration: var(--page-enter-duration);
        transition-timing-function: var(--page-enter-ease);
      }
      :host([data-tense='present']) {
        /* Example: Start transparent, fade in */
        opacity: 1;
      }
      :host([data-tense='future']) {
        /* Optionally hide future entries visually if needed beyond display:none */
        opacity: 0;
        scale: 1.05;
        --translate-x: 50% !important;

        transition-duration: var(--page-leave-duration);
        transition-timing-function: var(--page-leave-ease);
      }
    `,
  ],
  (v) => v
);
