import {StateFlow} from '@gaubee/flow';
import {func_lazy} from '@gaubee/util';
import type {LitElement} from 'lit';

export const flowColorScheme = func_lazy(() => {
  const colorSchemeMedia = matchMedia('(prefers-color-scheme: dark)');
  const colorScheme = (isDark: boolean) =>
    isDark ? ('dark' as const) : ('light' as const);
  const flow = new StateFlow(colorScheme(colorSchemeMedia.matches));
  // 添加监听（现代浏览器）
  colorSchemeMedia.addEventListener('change', (e) => {
    flow.value = colorScheme(e.matches);
  });
  return (ele?: LitElement) => {
    if (ele) {
      flow.watch(() => ele.requestUpdate());
    }
    return flow;
  };
});
export const flowScrollbarOverlay = func_lazy(() => {
  const flow = new StateFlow(
    /// 简单根据当前的光标行为判断一下，但这种判断并不准确，比如说开发模式下，模拟移动端，打开元素选择器，pointer的行为会发生改变
    matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  class ScrollbarTracker extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      const html = String.raw;
      this.shadowRoot!.innerHTML = html`<style>
          :host {
            position: absolute;
            top: -9999px;
            width: 100px;
            height: 100px;
            overflow: scroll;
            pointer-events: none;
            visibility: hidden;
          }
          :host,
          .scroll-view {
            position: absolute;
            top: -9999px;
            overflow: scroll;
            pointer-events: none;
            visibility: hidden;
          }
          :host {
            width: 0px;
            height: 0px;
          }
          .scroll-view {
            width: 100px;
            height: 100px;
          }
        </style>
        <div class="scroll-view"></div>`;
      this.scrollViewEle = this.shadowRoot!.querySelector(
        '.scroll-view'
      ) as HTMLDivElement;
    }
    scrollViewEle;
    private __resizeObserver?: ResizeObserver;
    connectedCallback() {
      this.__resizeObserver = new ResizeObserver((es) => {
        const isOverlay =
          es[0].contentBoxSize[0].inlineSize ===
          es[0].borderBoxSize[0].inlineSize;
        flow.value = isOverlay;
      });
      this.__resizeObserver.observe(this.scrollViewEle);
    }
    disconnectedCallback() {
      this.__resizeObserver?.disconnect();
      this.__resizeObserver = undefined;
    }
  }
  customElements.define('appn-scrollbar-tracker', ScrollbarTracker);
  const outer = new ScrollbarTracker();
  document.body.appendChild(outer);

  return (ele?: LitElement) => {
    if (ele) {
      flow.watch(() => ele.requestUpdate());
    }
    return flow;
  }; // 返回滚动条宽度
});
