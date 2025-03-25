import {customElementDeclarations} from '../custom-elements-metadata.js';
import footer from './footer.11ty.js';
import header from './header.11ty.js';
import nav from './nav.11ty.js';
import {relativePath as relative} from './relative-path.js';

import type {EleventyData} from './types.js';

export default function (data: EleventyData): string {
  const html = String.raw;
  const {title, page, content} = data;
  return html` <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
        />
        <title>${title}</title>
        <link rel="shortcut icon" href="/imgs/logo.webp" />
        <link rel="stylesheet" href="${relative(page.url, '/docs.css')}" />
        <link
          href="${relative(page.url, '/prism-okaidia.css')}"
          rel="stylesheet"
        />
        <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <script src="/node_modules/lit/polyfill-support.js"></script>
        ${customElementDeclarations
          .map((ele) => {
            return html`
              <script
                type="module"
                src="${relative(page.url, `/bundle/${ele.tagName}.js`)}"
              ></script>
            `;
          })
          .join('\n')}
      </head>
      <body>
        ${header(data, {default: nav(data)})}
        <div id="main-wrapper">
          <main>${content}</main>
        </div>
        ${footer(data)}
      </body>
    </html>`;
}
