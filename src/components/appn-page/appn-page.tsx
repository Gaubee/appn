import { Component, Host, Prop, h } from '@stencil/core';
import '../appn-header/appn-header';

@Component({
  tag: 'appn-page',
  styleUrl: 'appn-page.css',
  shadow: true,
})
export class AppnPage {
  @Prop({ attribute: 'pagetitle', mutable: true, reflect: true })
  pageTitle?: string;
  @Prop({ attribute: 'open', mutable: true, reflect: true })
  open = true;
  @Prop({ attribute: 'mode', mutable: true, reflect: true })
  mode: PageMode = 'screen';
  render() {
    return (
      <Host>
        <dialog open={this.open}>
          <div class="page">
            <div class="header">
              <slot name="header">
                <appn-header>{this.pageTitle}</appn-header>
              </slot>
            </div>
            <slot></slot>
            <div class="footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}

export type PageMode = 'screen' | 'dialog' | 'tooltip' | 'bottomsheet' | 'topsheet' | 'leftslide' | 'rightslide';
