import {customElementDeclarations} from '../custom-elements-metadata.js';
import {relativePath as relative} from './relative-path.js';

import type {EleventyData} from './types.js';

export default function (data: EleventyData): string {
  const html = String.raw;
  const {title, page, tags, description, content} = data;
  const safeUrl = (url: string) => relative(page.url, url);
  const polyfill = '';

  html` <link href="${safeUrl('/prism-okaidia.css')}" rel="stylesheet" />
    <script src="${safeUrl('/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js')}"></script>
    <script src="${safeUrl('/node_modules/lit/polyfill-support.js')}"></script>`;
  return html` <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="description" content="${description ?? ''}" />
        <meta name="keywords" content="${['Appn', 'WebComponent', tags].flat().filter(Boolean).join(', ') ?? ''}" />
        <meta name="author" content="Gaubee, gaubeebangeel@gmail.com" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
        <title>${title}</title>
        <link rel="shortcut icon" href="${safeUrl('/imgs/logo.webp')}" />
        <link rel="stylesheet" href="${safeUrl('/docs.css')}" />
        ${polyfill}
        ${customElementDeclarations
          .sort((a, b) => {
            const aw = a.tagName.endsWith('-provider') ? 1 : 0;
            const bw = b.tagName.endsWith('-provider') ? 1 : 0;
            return bw - aw;
          })
          .map((ele) => {
            return html` <script type="module" src="${relative(page.url, `/bundle/${ele.tagName}.js`)}"></script> `;
          })
          .join('\n')}
      </head>
      <body>
        ${content}
      </body>
    </html>`;
}
