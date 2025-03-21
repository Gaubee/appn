const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
// require('tsx/esm');
// const {renderToStaticMarkup} = require('react-dom/server');

module.exports = function (
  eleventyConfig: import('@11ty/eleventy').UserConfig
) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPassthroughCopy('docs-src/docs.css');
  eleventyConfig.addPassthroughCopy('docs-src/.nojekyll');
  eleventyConfig.addPassthroughCopy(
    'node_modules/@webcomponents/webcomponentsjs'
  );
  eleventyConfig.addPassthroughCopy('node_modules/lit/polyfill-support.js');
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
    templateExtensionAliases: {
      '11ty.cjs': '11ty.js',
      '11tydata.cjs': '11tydata.js',
    },
  };
};
