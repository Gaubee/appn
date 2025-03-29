import {customElementsMetadata} from '../docs-src/custom-elements-metadata.ts';
const ts = String.raw;
let intrinsicElementsCode = ts``;
let generateCode = ts`
import { createComponent } from '@lit/react';
import * as React from 'react';
`;
customElementsMetadata.modules.forEach((module) => {
  module.declarations.forEach((dec) => {
    if (dec.kind !== 'class') {
      return;
    }
    try {
      if (
        dec.customElement &&
        dec.tagName.startsWith('appn-') &&
        module.path.startsWith('src/components/')
      ) {
        generateCode += ts`
import {${dec.name}} from '${module.path.replace(/^src/, '.').replace(/.ts$/, '')}';
export const ${dec.name.replace(/Element$/, '')} = createComponent({react:React,tagName:'${dec.tagName}',elementClass:${dec.name}, events: {
  ${dec.events?.map((e) => `on${e.name.replace(/-/g, '')}:'${e.name}'`).join(',\n  ') ?? ''}
}});

`;
        intrinsicElementsCode += `'${dec.tagName}': React.DetailedHTMLProps<React.HTMLAttributes<${dec.name}>, ${dec.name}>;`;
      }
    } catch (e) {
      console.error(dec, e);
    }
  });
});
intrinsicElementsCode = ts`
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ${intrinsicElementsCode}
    }
  }
}`;

import prettier from 'prettier';
import prettierconfig from '../.prettierrc.json' with {type: 'json'};

import fs from 'node:fs';
import path from 'node:path';
fs.writeFileSync(
  path.resolve(import.meta.dirname, '../src/react.ts'),
  await prettier.format(generateCode, {
    ...(prettierconfig as any),
    parser: 'typescript',
  })
  // generateCode
);

// fs.writeFileSync;

// import {generateSolidJsTypes} from 'custom-element-solidjs-integration';
// generateSolidJsTypes(customElementsMetadata, {
//   outdir: path.resolve(import.meta.dirname, '../src'),
//   fileName: 'react-types.d.ts',
// });
