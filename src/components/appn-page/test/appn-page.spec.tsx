import { newSpecPage } from '@stencil/core/testing';
import { AppnPage } from '../appn-page';

const html = String.raw;

describe('appn-page', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppnPage], //AppnHeader
      html: html`<appn-page></appn-page>`,
    });
    expect(page.root).toEqualHtml(html`
      <appn-page open="" mode="screen">
        <mock:shadow-root>
          <dialog open="">
            <div class="page">
              <div class="header">
                <slot name="header">
                  <appn-header></appn-header>
                </slot>
              </div>
              <slot></slot>
              <div class="footer">
                <slot name="footer"></slot>
              </div>
            </div>
          </dialog>
        </mock:shadow-root>
      </appn-page>
    `);
  });
});
