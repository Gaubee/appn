import {relativePath as relative} from './relative-path.js';

import type {EleventyData} from './types.js';

export default function ({page}: EleventyData): string {
  const html = String.raw;
  console.log('QAQ page', page.url);
  const first_schema = page.url.slice(1).split('/').shift() || 'index';
  return html`<nav>
    <a
      class="${first_schema === 'index' ? 'target' : ''}"
      href="${relative(page.url, '/')}"
      >Home</a
    >
    <a
      class="${first_schema === 'examples' ? 'target' : ''}"
      href="${relative(page.url, '/examples/')}"
      >Examples</a
    >
    <a
      class="${first_schema === 'api' ? 'target' : ''}"
      href="${relative(page.url, '/api/')}"
      >API</a
    >
    <a
      class="${first_schema === 'install' ? 'target' : ''}"
      href="${relative(page.url, '/install/')}"
      >Install</a
    >
  </nav>`;
}
