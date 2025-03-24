import page from './page.11ty.js';
import {relativePath as relative} from './relative-path.js';
/**
 * This template extends the page template and adds an examples list.
 */
/**
 * This template extends the page template and adds an examples list.
 */
import type {EleventyData} from './types.js';

export default function (data: EleventyData): string {
  return page({
    ...data,
    content: renderExample(data),
  });
}

const renderExample = ({
  name,
  content,
  collections,
  page,
}: EleventyData): string => {
  const html = String.raw;
  return html`
    <section class="examples">
      <nav class="collection">
        <h2>Examples</h2>
        <ul>
          ${collections?.example
            ?.map(
              (post) => html`
                <li class=${post.url === page.url ? 'selected' : ''}>
                  <a href="${relative(page.url, post.url)}"
                    >${post.data.description.replace(/</g, '&lt;')}</a
                  >
                </li>
              `
            )
            .join('') ?? ''}
        </ul>
      </nav>
      <div class="content">
        <h2>Example: ${name}</h2>
        ${content}
      </div>
    </section>
  `;
};
