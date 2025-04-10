import fs from 'node:fs';
import path from 'node:path';
const htmlContent = fs.readFileSync(path.join(import.meta.dirname, 'color-mix-demo-1.html'), 'utf-8');

export default class Page {
  data() {
    return {title: 'color-mix Demo'};
  }
  render() {
    return htmlContent;
  }
}
