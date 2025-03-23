import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
// require('tsx/esm');
// const {renderToStaticMarkup} = require('react-dom/server');
import type {UserConfig} from '@11ty/eleventy';

export default function (eleventyConfig: UserConfig) {
  eleventyConfig.setTemplateFormats([
    'ts',
    'mts',
    'cts',
    'js',
    'mjs',
    'cjs',
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
  debugger;
  eleventyConfig.addPassthroughCopy(
    'node_modules/@webcomponents/webcomponentsjs',
    {debug: true}
  );
  eleventyConfig.addPassthroughCopy('bundle');
  eleventyConfig.addPassthroughCopy('node_modules/lit/polyfill-support.js');
  eleventyConfig.addWatchTarget('./bundle');
  // // We can add support for TypeScript too, at the same time:
  // eleventyConfig.addExtension(['11ty.jsx', '11ty.ts', '11ty.tsx'], {
  //   key: '11ty.js',
  //   compile: function () {
  //     return async function (data) {
  //       let content = await this.defaultRenderer(data);
  //       return renderToStaticMarkup(content);
  //     };
  //   },
  // });
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
