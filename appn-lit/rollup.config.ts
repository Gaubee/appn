/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import summary from 'rollup-plugin-summary';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {defineConfig} from 'rollup';
import path from 'node:path';
import fs from 'node:fs';
const componentsDir = path.resolve(import.meta.dirname, './src/components/');
const distDir = path.resolve(import.meta.dirname, './dist/');

const inputFiles = fs
  .readdirSync(componentsDir)
  .map((comName) => {
    return path.join(distDir, 'components', comName, comName + '.js');
  })
  .filter((filepath) => {
    return fs.existsSync(filepath);
  })
  .map((filepath) => {
    return path.relative(import.meta.dirname, filepath);
  });
console.log('QAQ inputFiles', inputFiles);
export default defineConfig({
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
    replace({preventAssignment: false, 'Reflect.decorate': 'undefined'}),
    resolve(),
    /**
     * This minification setup serves the static site generation.
     * For bundling and minification, check the README.md file.
     */
    terser({
      ecma: 2020,
      module: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    summary(),
  ],
});
