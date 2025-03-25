/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
import {LitElement, html, css} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {ResizeController} from '../../utils/resize-controller';
import {ScrollController} from '../../utils/scroll-controller';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('appn-scroll-view')
export class AppnScrollView extends LitElement {
  static override styles = css`
    :host {
      display: block;
      overflow: auto;
      position: relative;
      overflow: scroll;
      scrollbar-width: none;
    }
    .content {
      width: max(fit-content, inherited);
      height: max(fit-content, inherited);
      z-index: 1;
      position: relative;
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
      width: var(--host-width);
      height: var(--host-height);
      position: relative;
    }
    .scrollbar {
      position: absolute;
    }
    .axis-y {
      overflow-x: hidden;
      overflow-y: scroll;
      right: 0;
      top: 0;
      width: 15px;
      height: 100%;
      pointer-events: all;
    }
    .axis-x {
      overflow-x: scroll;
      overflow-y: hidden;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 15px;
      pointer-events: all;
    }
  `;
  @property({type: String, reflect: true, attribute: 'scrollbar-width'})
  scrollbarWidth: 'auto' | 'thin' | `${number}px` = 'auto';

  @state()
  private __contentWidth = 0;

  @state()
  private __contentHeight = 0;

  private __contentSize = new ResizeController(this, (entry) => {
    const borderBox = entry.borderBoxSize[0];
    this.__contentWidth = borderBox.inlineSize;
    this.__contentHeight = borderBox.blockSize;
  });

  @state()
  private __hostWidth = 0;

  @state()
  private __hostHeight = 0;
  private __hostSize = new ResizeController(this, (entry) => {
    const borderBox = entry.borderBoxSize[0];
    this.__hostWidth = borderBox.inlineSize;
    this.__hostHeight = borderBox.blockSize;
    console.log('QAQ host', borderBox);
  });
  @query('.axis-y', true)
  eleAxisY!: HTMLDivElement;
  @query('.axis-x', true)
  eleAxisX!: HTMLDivElement;
  private __axisYScroll = new ScrollController(this, (event) => {
    this.scrollTop = event.target.scrollTop;
  });
  private __axisXScroll = new ScrollController(this, (event) => {
    this.scrollLeft = event.target.scrollLeft;
  });

  private __hostScroll = new ScrollController(this, (event) => {
    this.eleAxisY.scrollTop = event.target.scrollTop;
    this.eleAxisX.scrollLeft = event.target.scrollLeft;
  });

  protected override render() {
    this.__hostSize.bindElement(this);
    this.__hostScroll.bindElement(this);
    return html`
      <style>
        :host {
          --host-width: ${this.__hostWidth}px;
          --host-height: ${this.__hostHeight}px;
        }
        .mock-content {
          width: ${this.__contentWidth}px;
          height: ${this.__contentHeight}px;
        }
      </style>
      <div class="scrollbar-sticky">
        <div class="scrollbar-wrapper">
          <div class="scrollbar axis-y" ${this.__axisYScroll.observe()}>
            <div class="mock-content"></div>
          </div>
          <div class="scrollbar axis-x" ${this.__axisXScroll.observe()}>
            <div class="mock-content"></div>
          </div>
        </div>
      </div>
      <div class="content" ${this.__contentSize.observe()}><slot></slot></div>
    `;
  }
}
