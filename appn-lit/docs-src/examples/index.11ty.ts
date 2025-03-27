import page from '../_includes/page.11ty';
import {renderExampleNav} from '../_includes/example.11ty';
import type {EleventyData} from '../_includes/types';

export default class Page {
  data() {
    return {
      title: 'AppnPage Examples',
    };
  }
  render(data: EleventyData) {
    console.log('QAQ data.collections', data.collections);
    return page({
      ...data,
      content: renderExampleNav(data, true),
    });
  }
}
