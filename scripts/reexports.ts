import { FileEntry } from '@gaubee/nodekit';
import path from 'node:path';
import fs from 'node:fs';
const packageJsonEntry = new FileEntry(path.resolve(import.meta.dirname, '../package.json'));
const packageJson = packageJsonEntry.readJson<typeof import('../package.json')>();
const components = fs
  .readdirSync(path.resolve(import.meta.dirname, '../src/components'))
  //
  .filter(name => !name.startsWith('.'));
packageJson.exports = {
  '.': {
    import: './dist/appn/appn.esm.js',
    require: './dist/appn/appn.cjs.js',
  },
  ...components.reduce(
    (exports, name) => {
      exports[`./${name}`] = {
        import: `./dist/components/${name}.js`,
        types: `./dist/components/${name}.d.ts`,
      };
      return exports;
    },
    {} as Record<string, object>,
  ),
  './loader': {
    import: './loader/index.js',
    require: './loader/index.cjs',
    types: './loader/index.d.ts',
  },
} as any;
packageJsonEntry.writeJson(packageJson);
