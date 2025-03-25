import type {EleventyData, Slots} from './types.js';

export default function (
  data: EleventyData,
  slots: Slots<'default'> = {}
): string {
  const html = String.raw;
  return html`<header class="bg-ani">
    <h1>Appn</h1>
    <h2>
      A web component library focuses on building a common Webapp navigation
      standard on the Web.
    </h2>
    ${slots.default ?? ''}
  </header>`;
}
