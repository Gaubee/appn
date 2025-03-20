import { newSpecPage } from '@stencil/core/testing';
import { AppnHeader } from '../appn-header';
const html = String.raw;

describe('appn-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppnHeader],
      html: html`<appn-header pageTitle="Hi"></appn-header>`,
    });
    expect(page.root).toEqualHtml(html`
      <appn-header pageTitle="Hi">
        <mock:shadow-root>
          <slot name="start">START</slot>
          <slot name="title">Hi</slot>
          <slot name="end">END</slot>
        </mock:shadow-root>
      </appn-header>
    `);
  });
});
