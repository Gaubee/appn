import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import 'tsx/esm';
import {renderToStaticMarkup} from 'react-dom/server';
import type {UserConfig} from '@11ty/eleventy';

export default function (eleventyConfig: UserConfig) {
  eleventyConfig.setTemplateFormats([
    'ts|tsx|mts|cts|js|jsx|mjs|cjs'.split('|').map((ext) => `11ty.${ext}`),
    'md',
    'mdx',
  ]);
  eleventyConfig.on('importCacheReset', (paths) => {
    console.log('QAQ paths', require.cache, paths);
    for (const dep of paths) {
      delete require.cache[require.resolve(dep)];
    }
  });

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
  eleventyConfig.addPassthroughCopy('docs-src/docs.css');
  eleventyConfig.addPassthroughCopy('docs-src/.nojekyll');
  eleventyConfig.addPassthroughCopy(
    'node_modules/@webcomponents/webcomponentsjs'
  );
  eleventyConfig.addPassthroughCopy('imgs');
  eleventyConfig.addPassthroughCopy('bundle');
  eleventyConfig.addPassthroughCopy('node_modules/lit/polyfill-support.js');
  eleventyConfig.addWatchTarget('./bundle');
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
