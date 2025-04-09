import {renderExampleNav} from '../_includes/example.11ty';
import page from '../_includes/page.11ty';
import type {EleventyData} from '../_includes/types';

export default class Page {
  data() {
    return {
      title: 'AppnPage Examples',
    };
  }
  render(data: EleventyData) {
    return page({
      ...data,
      content: renderExampleNav(data, true),
    });
  }
}
