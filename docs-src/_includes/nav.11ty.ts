import {relativePath as relative} from './relative-path.js';

import type {EleventyData} from './types.js';

export default function ({page}: EleventyData): string {
  const html = String.raw;
  const first_schema = page.url.slice(1).split('/').shift() || 'index';
  return html` <style>
      .nav {
        margin-top: 2em;
        padding: 0 2em;
        border-radius: 2em;
        backdrop-filter: contrast(0.5) brightness(2);
        width: fit-content;
        max-width: 100%;
      }
      .nav {
        display: grid;
        grid-template-columns: repeat(auto-fit, 180px);
        justify-content: center;
        gap: 24px;
      }

      .nav > a {
        display: block;
        flex: 1;
        font-size: 18px;
        padding: 16px;
        text-align: center;
      }
    </style>
    <nav class="nav">
      <a class="${first_schema === 'index' ? 'target' : ''}" href="${relative(page.url, '/')}">Home</a>
      <a class="${first_schema === 'examples' ? 'target' : ''}" href="${relative(page.url, '/examples/')}">Examples</a>
      <a class="${first_schema === 'api' ? 'target' : ''}" href="${relative(page.url, '/api/')}">API</a>
      <a class="${first_schema === 'install' ? 'target' : ''}" href="${relative(page.url, '/install/')}">Install</a>
    </nav>`;
}
