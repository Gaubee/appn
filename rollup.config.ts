/**
 * @license
 * Copyright 2025 Gaubee
 * License: MIT
 */
import 'tsx';

import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import fs from 'node:fs';
import path from 'node:path';
import {defineConfig} from 'rollup';
import {minifyTemplateLiterals} from 'rollup-plugin-minify-template-literals';
import summary from 'rollup-plugin-summary';

const {getComponentsEntry} = await import('./docs-src/custom-elements-metadata.ts');

const inputFiles = getComponentsEntry().map((entry) => entry.dist);
export default defineConfig((env) => {
  return {
    input: inputFiles,
    output: {
      dir: 'bundle',
      format: 'esm',
    },
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      {
        name: 'empty-output-dir',
        buildStart(options) {
          fs.rmSync(path.resolve(import.meta.dirname, './bundle'), {recursive: true, force: true});
        },
      },
      replace({preventAssignment: false, 'Reflect.decorate': 'undefined'}),
      resolve(),
      // /**
      //  * This minification setup serves the static site generation.
      //  * For bundling and minification, check the README.md file.
      //  */
      // terser({
      //   // ecma: 2020,
      //   module: true,
      //   compress: false,
      //   mangle: {
      //     properties: {
      //       regex: /^__/,
      //     },
      //   },
      // }),
      minifyTemplateLiterals(),
      summary(),
      {
        name: 'generate-react-types',
        async buildEnd(error) {
          const {doWrite} = await import('./scripts/react-generator');
          doWrite(true);
          console.log('react.ts generated!!');
        },
      },
    ],
  };
});
