import fs from 'node:fs';
import path from 'node:path';

export default class Page {
  data() {
    return {title: 'color-mix() Demo 1'};
  }
  render() {
    const htmlContent = fs.readFileSync(path.join(import.meta.dirname, 'color-mix-demo-1.html'), 'utf-8');
    return htmlContent;
  }
}
