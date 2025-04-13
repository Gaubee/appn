import fs from 'node:fs';
import path from 'node:path';

export default class Page {
  data() {
    return {title: 'animation-reverse Demo'};
  }
  render() {
    const htmlContent = fs.readFileSync(path.join(import.meta.dirname, 'transaction-demo.html'), 'utf-8');
    return htmlContent;
  }
}
