import {iter_map_not_null} from '@gaubee/util';
import {css} from 'lit';

export const appnNavigationStyle = css`
  :host {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'stack';
    width: 100cqw;
    height: 100cqh;
    overflow: hidden;
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
    --translate-z: calc((var(--present-index, -1) - var(--index, 0)) * -36px);
    translate: var(--translate-x, 0) var(--translate-y, 0) var(--translate-z);
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
        transition-duration: var(--page-leave-duration);
        transition-timing-function: var(--page-leave-ease);
      }
      :host([data-tense='past']) {
        --translate-x: -38%;
        display: none;
      }
      :host([data-tense='present']) {
        /* Example: Start transparent, fade in */
        --translate-x: 0%;
        transition-duration: var(--page-enter-duration);
        transition-timing-function: var(--page-enter-ease);
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
        transition-duration: var(--page-enter-duration);
        transition-timing-function: var(--page-enter-ease);
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
