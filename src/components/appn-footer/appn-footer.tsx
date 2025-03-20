import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'appn-footer',
  styleUrl: 'appn-footer.css',
  shadow: true,
})
export class AppnFooter {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
