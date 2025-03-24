import type {EleventyData} from './types.js';

export default function (data: EleventyData): string {
  const html = String.raw;
  return html`<footer class="bg-ani">
    <ol>
      <li>
        <a target="_blank" href="https://github.com/gaubee/appn">Github</a>
      </li>
    </ol>
  </footer>`;
}
