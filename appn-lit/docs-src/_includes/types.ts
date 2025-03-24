import type {CustomElementsJson} from '../custom-elements-metadata.js';

export interface EleventyData {
  title?: string;
  page: {
    url: string;
    [key: string]: unknown;
  };
  content: string;
  collections?: {
    example?: Array<{
      url: string;
      data: {
        description: string;
        [key: string]: unknown;
      };
    }>;
    [key: string]: unknown;
  };
  name?: string;
  description?: string;
  customElements?: CustomElementsJson;
}
