import {customElementDeclarations} from '../custom-elements-metadata.js';
import footer from './footer.11ty.js';
import header from './header.11ty.js';
import nav from './nav.11ty.js';
import {relativePath as relative} from './relative-path.js';

import type {EleventyData} from './types.js';

export default function (data: EleventyData): string {
  const html = String.raw;
  const {title, page, tags, description, content} = data;
  const safeUrl = (url: string) => relative(page.url, url);
  return html` <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="description" content="${description ?? ''}" />
        <meta
          name="keywords"
          content="${['Appn', 'WebComponent', tags]
            .flat()
            .filter(Boolean)
            .join(', ') ?? ''}"
        />
        <meta name="author" content="Gaubee, gaubeebangeel@gmail.com" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
        />
        <title>${title}</title>
        <link rel="shortcut icon" href="${safeUrl('/imgs/logo.webp')}" />
        <link rel="stylesheet" href="${safeUrl('/docs.css')}" />
        <link href="${safeUrl('/prism-okaidia.css')}" rel="stylesheet" />

        <script src="${safeUrl(
            '/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
          )}"></script>
        <script src="${safeUrl(
            '/node_modules/lit/polyfill-support.js'
          )}"></script>
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
