import { Component, Host, Prop, h, Element } from '@stencil/core';
import '../appn-header/appn-header';
import { queryEffect } from '../../utils/utils';
import { func_catch } from '@gaubee/util';

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
  @Element()
  host!: HTMLElement;

  private offs: Array<() => void> = [];
  private addOffEffect = (factory: () => () => void) => {
    this.offs.push(factory());
  };
  componentDidLoad() {
    this.addOffEffect(() =>
      queryEffect(this.host.shadowRoot, '.header', ele => {
        if (ele) {
          const resizeObserver = new ResizeObserver(entries => {
            const height = entries[0].borderBoxSize[0].blockSize;
            this.host.style.setProperty('--page-header-height', height + 'px');
          });
          resizeObserver.observe(ele);
          return () => {
            resizeObserver.disconnect();
          };
        }
      }),
    );
    this.addOffEffect(() =>
      queryEffect(this.host.shadowRoot, '.footer', ele => {
        if (ele) {
          const resizeObserver = new ResizeObserver(entries => {
            const height = entries[0].borderBoxSize[0].blockSize;
            this.host.style.setProperty('--page-footer-height', height + 'px');
          });
          resizeObserver.observe(ele);
          return () => {
            resizeObserver.disconnect();
          };
        }
      }),
    );
  }
  disconnectedCallback() {
    for (const off of this.offs) {
      void func_catch(off)();
    }
    this.offs = [];
  }
  render() {
    return (
      <Host>
        <dialog open={this.open} part="layer">
          <div class="root" part="root">
            <div class="header" part="header">
              <slot name="header">
                <appn-header>{this.pageTitle}</appn-header>
              </slot>
            </div>
            <div class="body" part="body">
              <slot></slot>
            </div>
            <div class="footer" part="footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}

export type PageMode = 'screen' | 'dialog' | 'tooltip' | 'bottomsheet' | 'topsheet' | 'leftslide' | 'rightslide';
