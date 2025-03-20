import { newE2EPage } from '@stencil/core/testing';

describe('appn-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<appn-footer></appn-footer>');

    const element = await page.find('appn-footer');
    expect(element).toHaveClass('hydrated');
  });
});
