import type {EleventyData} from './types.js';

export default function (data: EleventyData): string {
  const html = String.raw;
  return html` <footer>
    <ol>
      <li><a href="https://github.com/gaubee/appn">Github</a></li>
    </ol>
  </footer>`;
}
