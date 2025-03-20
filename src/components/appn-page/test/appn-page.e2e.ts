import { newE2EPage } from '@stencil/core/testing';

describe('appn-page', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<appn-page></appn-page>');

    const element = await page.find('appn-page');
    expect(element).toHaveClass('hydrated');
  });
});
