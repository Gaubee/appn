import type {UserConfig} from '@11ty/eleventy';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {renderToStaticMarkup} from 'react-dom/server';
import {match} from 'ts-pattern';
import 'tsx/esm';
import type {UserConfig as ViteUserConfig} from 'vite';
const resolve = (to: string) => path.resolve(import.meta.dirname, to);
const useVite = match(process.env.USE_VITE)
  .with('', 'true', 'TRUE', () => true)
  .with('false', 'FALSE', () => false)
  .otherwise((v) => {
    if (v != null) {
      console.warn(`Invalid USE_VITE value: ${JSON.stringify(v)}`);
    }
    return os.platform() === 'darwin';
  });
Object.assign(globalThis, {useVite});
declare global {
  var useVite: boolean;
}
export default function (eleventyConfig: UserConfig) {
  fs.rmSync(resolve('docs'), {recursive: true, force: true});
  fs.mkdirSync(resolve('docs/public'), {recursive: true});

  eleventyConfig.setTemplateFormats([
    // javascript
    ...'ts|tsx|mts|cts|js|jsx|mjs|cjs'.split('|').map((ext) => `11ty.${ext}`),
    // markdown
    'md',
    'mdx',
    // html
    'html',
  ]);
  eleventyConfig.on('importCacheReset', (paths) => {
    for (const dep of paths) {
      delete require.cache[require.resolve(dep)];
    }
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  if (useVite) {
    /// 注意，使用vite编译，就不能使用 setServerPassthroughCopyBehavior('passthrough')，vite要求fs中能看到文件
    eleventyConfig.addPlugin(EleventyVitePlugin, {
      viteOptions: {
        esbuild: {
          supported: {
            decorators: false,
          },
        },
        build: {
          target: 'es2022',
        },
      } satisfies ViteUserConfig,
    });
    eleventyConfig.addPassthroughCopy({bundle: 'public/bundle'});
    // bundle 文件夹是动态的，使用symlink
    // fs.symlinkSync(resolve('bundle'), resolve('docs/public/bundle'), 'junction');
  } else {
    // eleventyConfig.setServerPassthroughCopyBehavior('copy');
    eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
    // eleventyConfig.addPassthroughCopy('bundle');
    eleventyConfig.addPassthroughCopy({bundle: 'public/bundle'});
  }
  eleventyConfig.addPassthroughCopy({'imgs/logo.webp': 'favicon.ico'});
  eleventyConfig.addPassthroughCopy('components');
  eleventyConfig.addPassthroughCopy('docs-src/docs.css');
  eleventyConfig.addPassthroughCopy('docs-src/.nojekyll');
  eleventyConfig.addPassthroughCopy('docs-src/components');
  eleventyConfig.addPassthroughCopy('docs-src/public');
  eleventyConfig.addPassthroughCopy('node_modules/@webcomponents/webcomponentsjs');
  eleventyConfig.addPassthroughCopy('node_modules/prismjs/themes');
  eleventyConfig.addPassthroughCopy('@virtualstate/navigation/esnext');
  eleventyConfig.addPassthroughCopy('imgs');
  eleventyConfig.addPassthroughCopy('node_modules/lit/polyfill-support.js');
  eleventyConfig.ignores.delete('README.md');
  eleventyConfig.addWatchTarget('bundle');
  eleventyConfig.addWatchTarget('docs-src/**/*.html');
  // add support for TypeScript and JSX:
  eleventyConfig.addExtension(['11ty.jsx', '11ty.tsx'], {
    key: '11ty.js',
    compile: function () {
      return async function (data) {
        let content = await this.defaultRenderer(data);
        return renderToStaticMarkup(content);
      };
    },
  });
  eleventyConfig.addExtension(['11ty.ts'], {
    key: '11ty.js',
  });
  return {
    dir: {
      input: 'docs-src',
      output: 'docs',
    },
    // templateExtensionAliases: {
    //   '11ty.js': '11ty.js',
    //   '11tydata.js': '11tydata.js',
    // },
  };
}
