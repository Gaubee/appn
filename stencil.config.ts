import { FileEntry } from '@gaubee/nodekit';
import { Config } from '@stencil/core';
import path from 'node:path';

export const config: Config = {
  namespace: 'appn',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'docs-custom',
      generator: docs => {
        // Custom logic goes here
        {
          const readmeEntry = new FileEntry(path.resolve(__dirname, './README.md'));

          const contents = readmeEntry.readText().split(`<!-- Auto Generated Below -->`);
          contents[1] = `

## Components

${docs.components
  .map(com => {
    return `- [${path.basename(com.dirPath!)}](${path.relative(readmeEntry.dir, com.readmePath!)})`;
  })
  .join('\n')}
`;
          readmeEntry.write(contents.join(`<!-- Auto Generated Below -->`));
        }

        {
          const readmeZhEntry = new FileEntry(path.resolve(__dirname, './README_zh.md'));

          const contents = readmeZhEntry.readText().split(`<!-- Auto Generated Below -->`);
          contents[1] = `

## 组件

${docs.components
  .map(com => {
    return `- [${path.basename(com.dirPath!)}](${path.relative(readmeZhEntry.dir, com.readmePath!)})`;
  })
  .join('\n')}
`;
          readmeZhEntry.write(contents.join(`<!-- Auto Generated Below -->`));
        }
      },
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: 'shell',
  },
};
