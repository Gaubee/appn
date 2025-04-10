import {func_remember} from '@gaubee/util';
import {Signal} from 'signal-polyfill';

/**
 * 使用一个CustomElement可以避免样式污染，从而获取浏览器最原始的滚动条样式。
 *
 * 因为并没有专门的 media-query 可以用来判断浏览器默认行为到底是不是 overlay-scrollbar。
 * 通常来说有的平台有精确光标的，会对scrollbar进行渲染显示，否则会进行隐藏。
 * 当我们不能因此就这样简单判定，因为开发者模式的模拟，会模拟移动端的 overlay-scrollbar，所以即便此时没有精确光标，它也会 overlay-scrollbar
 *
 * 所以，这里的 ScrollbarTrackerElement 的思路就是从浏览器样式来进行入手，因为 scrollbar-width 是会影响渲染的，从这里入手去监听它是否感染了渲染宽度，从而判断是否 overlay-scrollbar
 *
 * @hideconstructor
 */
class ScrollbarTrackerElement extends HTMLElement {
  constructor(
    readonly isOverlayState: Signal.State<boolean>,
    options: {
      scrollbarWidth?: ('auto' /* 15px */ | 'tine' /* 11px */ | 'none') & string;
    } = {}
  ) {
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
          scrollbar-width: ${options.scrollbarWidth ?? 'auto'};
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
          scrollbar-width: auto;
        }
        .scroll-view-thin {
          width: 100px;
          height: 100px;
          scrollbar-width: thin;
        }
      </style>
      <div class="scroll-view"></div>
      <div class="scroll-view-thin"></div>`;
    this.__scrollViewEle = this.shadowRoot!.querySelector('.scroll-view') as HTMLDivElement;
    this.__scrollViewThinEle = this.shadowRoot!.querySelector('.scroll-view-thin') as HTMLDivElement;
  }
  readonly scrollbarAutoWidth = new Signal.State<number>(16);
  readonly scrollbarThinWidth = new Signal.State<number>(11);

  private __scrollViewEle;
  private __scrollViewThinEle;
  private __resizeObserver?: ResizeObserver;
  connectedCallback() {
    this.__resizeObserver = new ResizeObserver((es) => {
      for (const entry of es) {
        const scrollbarWidth = es[0].borderBoxSize[0].inlineSize - es[0].contentBoxSize[0].inlineSize;
        if (entry.target.className === 'scroll-view') {
          this.scrollbarAutoWidth.set(scrollbarWidth);
        } else if (entry.target.className === 'scroll-view-thin') {
          this.scrollbarThinWidth.set(scrollbarWidth);
        }
      }
      const isOverlay = this.scrollbarAutoWidth.get() === 0;
      this.isOverlayState.set(isOverlay);
    });
    this.__resizeObserver.observe(this.__scrollViewEle);
    this.__resizeObserver.observe(this.__scrollViewThinEle);
  }
  disconnectedCallback() {
    this.__resizeObserver?.disconnect();
    this.__resizeObserver = undefined;
  }
}
customElements.define('iappn-scrollbar-tracker', ScrollbarTrackerElement);
export const scrollbarOverlayStateify = func_remember(() => {
  const state = new Signal.State(
    /// 简单根据当前的光标行为判断一下，但这种判断并不准确，比如说开发模式下，模拟移动端，打开元素选择器，pointer的行为会发生改变
    matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  const outer = new ScrollbarTrackerElement(state);
  document.body.appendChild(outer);

  return state;
});
