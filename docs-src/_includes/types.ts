import type {CustomElementsJson} from '../custom-elements-metadata.js';

export interface EleventyData {
  title?: string;
  page: {
    url: string;
    [key: string]: unknown;
  };
  tags?: string | string[];
  scripts?: string[];
  links?: string[];
  content: string;
  collections?: {
    example?: Array<{
      url: string;
      data: EleventyExampleData;
    }>;
    [key: string]: unknown;
  };
  description?: string;
  customElements?: CustomElementsJson;
}

export interface EleventyExampleData extends EleventyData {
  tags: 'example' | ['example'];
  name: string;
  showNav?: boolean;
}

export type Slots<K extends string> = {[slotName in K]?: string};
