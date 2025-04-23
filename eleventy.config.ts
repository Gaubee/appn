import type {UserConfig as EleventyUserConfig} from '@11ty/eleventy';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import {func_throttle} from '@gaubee/util';
import fs from 'node:fs';
import path from 'node:path';
import {renderToStaticMarkup} from 'react-dom/server';
import 'tsx/esm';
import type {UserConfig as ViteUserConfig} from 'vite';
const resolve = (to: string) => path.resolve(import.meta.dirname, to);

export default function (eleventyConfig: EleventyUserConfig) {
  const isWatch = process.argv.includes('--watch');
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
      server: {
        watch: {},
      },
    } satisfies ViteUserConfig,
  });
  eleventyConfig.setServerPassthroughCopyBehavior('copy');
  eleventyConfig.addPassthroughCopy('bundle');
  eleventyConfig.addPassthroughCopy({'imgs/logo.webp': 'favicon.ico'});
  eleventyConfig.addPassthroughCopy('components');
  eleventyConfig.addPassthroughCopy('docs-src/docs.css');
  eleventyConfig.addPassthroughCopy('docs-src/css');
  eleventyConfig.addPassthroughCopy('docs-src/.nojekyll');
  eleventyConfig.addPassthroughCopy('docs-src/components');
  eleventyConfig.addPassthroughCopy('docs-src/public');
  eleventyConfig.addPassthroughCopy('node_modules/@webcomponents/webcomponentsjs');
  eleventyConfig.addPassthroughCopy('node_modules/prismjs/themes');
  eleventyConfig.addPassthroughCopy('imgs');
  eleventyConfig.addPassthroughCopy('node_modules/lit/polyfill-support.js');
  eleventyConfig.ignores.delete('README.md');

  // eleventyConfig.addWatchTarget('bundle');
  // 这里 bundle 的监听不生效，所以这里手动关闭进程，让node --watch 自动重启
  if (isWatch) {
    const exit = func_throttle(() => process.exit(0), 1000);
    fs.watch(resolve('bundle'), {}, (event, filename) => {
      exit();
    });
  }
  // eleventyConfig.addWatchTarget('src', {
  //   resetConfig: true,
  // });
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
