import { newE2EPage } from '@stencil/core/testing';

describe('appn-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<appn-header></appn-header>');

    const element = await page.find('appn-header');
    expect(element).toHaveClass('hydrated');
  });
});
