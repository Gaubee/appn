import {iter_map_not_null} from '@gaubee/util';
import {css} from 'lit';
import {isSupportViewTransition} from '../../utils/css-helper';
import {cssLiteral} from '../../utils/lit-helper';
export const pageFutureTranslateX = cssLiteral('100%');
export const pageFutureTranslateY = cssLiteral('0%');
export const pageFutureScaleX = cssLiteral('100%');
export const pageFutureScaleY = cssLiteral('100%');
export const pageFutureOpacity = cssLiteral('100%');

export const pagePastTranslateX = cssLiteral('-38%');
export const pagePastTranslateY = cssLiteral('0%');
export const pagePastScaleX = cssLiteral('100%');
export const pagePastScaleY = cssLiteral('100%');
export const pagePastOpacity = cssLiteral('100%');

export const pageBootTranslateX = cssLiteral('0%');
export const pageBootTranslateY = cssLiteral('0%');
export const pageBootScaleX = cssLiteral('90%');
export const pageBootScaleY = cssLiteral('90%');
export const pageBootOpacity = cssLiteral('50%');

CSS.registerProperty({
  name: '--page-translate-x',
  syntax: '<length-percentage>',
  inherits: false,
  initialValue: `0px`,
});
CSS.registerProperty({
  name: '--page-translate-y',
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
    --page-translate-z: calc((var(--present-index, -1) - var(--index, 0)) * -36px);
    translate: var(--page-translate-x, 0) var(--page-translate-y, 0) var(--page-translate-z);
    scale: var(--page-scale-x, 100%) var(--page-scale-y, 100%);
  }
`;

export const appnNavigationHistoryEntryStyle = iter_map_not_null([
  css`
    :host {
      /** 充满grid容器 */
      place-self: stretch;
      display: grid;

      transition-property: all;
      transition-behavior: allow-discrete;
    }
    :host([data-tense='future']) {
      --page-translate-x: ${pageFutureTranslateX};
      --page-translate-y: ${pageFutureTranslateY};
      --page-scale-x: ${pageFutureScaleX};
      --page-scale-y: ${pageFutureScaleY};
      --page-opacity: ${pageFutureOpacity};
    }
    :host([data-tense='past']) {
      --page-translate-x: ${pagePastTranslateX};
      --page-translate-y: ${pagePastTranslateY};
      --page-scale-x: ${pagePastScaleX};
      --page-scale-y: ${pagePastScaleY};
      --page-opacity: ${pagePastOpacity};
    }
    :host([data-tense='future']:not([data-view-transition-lifecycle])),
    :host([data-tense='past']:not([data-view-transition-lifecycle])) {
      display: none;
    }
  `,
  isSupportViewTransition
    ? css`
        ::view-transition-group(*) {
          animation-duration: 1s;
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
      `,
]);
