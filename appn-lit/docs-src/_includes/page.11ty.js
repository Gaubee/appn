import header from './header.11ty.js';
import footer from './footer.11ty.js';
import nav from './nav.11ty.js';
import {relativePath as relative} from './relative-path.js';
import customElements from '../../custom-elements.json' with {type: 'json'};

export default function (data) {
  const html = String.raw;
  const {title, page, content} = data;
  const elements = customElements.modules.map((m) => m.declarations).flat();
  return html` <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <link rel="stylesheet" href="${relative(page.url, '/docs.css')}" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Roboto+Mono"
        />
        <link
          href="${relative(page.url, '/prism-okaidia.css')}"
          rel="stylesheet"
        />
        <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
        <script src="/node_modules/lit/polyfill-support.js"></script>
        ${elements
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
        ${header()} ${nav(data)}
        <div id="main-wrapper">
          <main>说的是事实${content}</main>
        </div>
        ${footer()}
      </body>
    </html>`;
}
