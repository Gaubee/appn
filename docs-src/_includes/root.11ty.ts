import {getComponentsEntry} from '../custom-elements-metadata.js';

import type {EleventyData} from './types.js';
declare global {
  var useVite: boolean;
}
export default function (data: EleventyData): string {
  const html = String.raw;
  const {title, tags, description, content, scripts, links} = data;

  return html` <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="description" content="${description ?? ''}" />
        <meta name="keywords" content="${['Appn', 'WebComponent', tags].flat().filter(Boolean).join(', ') ?? ''}" />
        <meta name="author" content="Gaubee, gaubeebangeel@gmail.com" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0" />
        <title>${title}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        ${scripts?.map((script_src) => html`<script type="module" src=${script_src}></script>`).join('') ?? ''}
        ${links?.map((link_href) => html`<link rel="stylesheet" href=${link_href} />`) ?? ''}
        <script type="module" src="/bundle/polyfill.js"></script>
        <!-- ${getComponentsEntry()
          .map((entry) => {
            return html`<script type="module" src="${entry.bundle}"></script>`;
          })
          .join('\n')} -->
        <script type="module" src="/bundle/index.js"></script>
        <link rel="stylesheet" href="/prismjs/prism-okaidia.css" />
        <link rel="stylesheet" href="/css/index.css" />
      </head>
      <body>
        ${content}
      </body>
    </html>`;
}
