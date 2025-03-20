import { Component, Host, Prop, h } from '@stencil/core';

/**
 * @slot 用于放置自定义标题内容，默认是单行
 * @slot start - 用于放置 返回按钮、菜单按钮
 * @slot end - 用于放置 页面功能按钮
 */
@Component({
  tag: 'appn-header',
  styleUrl: 'appn-header.css',
  shadow: true,
})
export class AppnHeader {
  @Prop({ attribute: 'lines', mutable: true, reflect: true })
  lines = 1;
  render() {
    return (
      <Host>
        <div class="leading">
          <slot name="start"></slot>
        </div>
        <div class="title" style={{ '--title-clamp': `${this.lines}` }}>
          <slot></slot>
        </div>
        <div class="actions">
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
