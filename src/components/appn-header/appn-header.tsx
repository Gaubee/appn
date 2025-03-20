import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'appn-header',
  styleUrl: 'appn-header.css',
  shadow: true,
})
export class AppnHeader {
  @Prop({ attribute: 'pagetitle', mutable: true, reflect: true })
  pageTitle?: string;
  render() {
    return (
      <Host>
        <slot name="start">{'START'}</slot>
        <slot name="title">{this.pageTitle}</slot>
        <slot name="end">{'END'}</slot>
      </Host>
    );
  }
}
