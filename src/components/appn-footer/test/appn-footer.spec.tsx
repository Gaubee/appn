import { newSpecPage } from '@stencil/core/testing';
import { AppnFooter } from '../appn-footer';

describe('appn-footer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppnFooter],
      html: `<appn-footer></appn-footer>`,
    });
    expect(page.root).toEqualHtml(`
      <appn-footer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </appn-footer>
    `);
  });
});
