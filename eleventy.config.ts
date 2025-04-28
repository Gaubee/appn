import type {UserConfig as EleventyUserConfig} from '@11ty/eleventy';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import EleventyVitePlugin from '@11ty/eleventy-plugin-vite';
import {func_throttle} from '@gaubee/util';
import chokidar, {FSWatcher} from 'chokidar';
import fs from 'node:fs';
import path from 'node:path';
import {renderToStaticMarkup} from 'react-dom/server';
import 'tsx/esm';
import type {PluginOption, UserConfig as ViteUserConfig} from 'vite';
const resolve = (to: string) => path.resolve(import.meta.dirname, to);

export default function (eleventyConfig: EleventyUserConfig) {
  // const isWatch = process.argv.includes('--watch');
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
      plugins: [
        (() => {
          const bundleDir = resolve('bundle');
          const getModuleId = (bundle_filename: string) => {
            const moduleId = '/' + path.relative(import.meta.dirname, bundle_filename).replaceAll('\\', '/');
            return moduleId;
          };
          return {
            enforce: 'pre',
            name: 'bundle-resolver',
            async configureServer(server) {
              const ws = server.ws;
              if (!ws) {
                return;
              }
              let watcher: FSWatcher | undefined;

              const startWatch = async (ignoreInitial = true) => {
                void watcher?.close();

                watcher = chokidar.watch(
                  bundleDir,

                  {
                    persistent: true, // 持续监听
                    ignoreInitial, // 忽略初始扫描时的 'add' 和 'addDir' 事件
                    awaitWriteFinish: {
                      // 等待写入完成，有助于减少因写入不完整而触发的事件
                      stabilityThreshold: 500, // 文件大小稳定时间 (ms)
                      pollInterval: 100, // 轮询间隔 (ms)
                    },
                  }
                );
                watcher.on('all', async (event, bundle_filename) => {
                  if (event === 'unlinkDir') {
                    if (bundle_filename === bundleDir) {
                      startWatch(false);
                      return;
                    }
                  }
                  if (event === 'unlink' || event === 'unlinkDir') {
                    return;
                  }

                  const moduleId = getModuleId(bundle_filename);
                  const moduleNode = await server.moduleGraph.getModuleById(moduleId);
                  if (moduleNode) {
                    server.moduleGraph.invalidateModule(moduleNode, undefined, undefined, true);
                    ws.send({
                      type: 'update',
                      updates: [
                        {
                          type: 'js-update',
                          path: moduleNode.url,
                          acceptedPath: moduleNode.url,
                          timestamp: Date.now(),
                        },
                      ],
                    });
                    reload();
                  }
                });
                console.log('start watching', bundleDir);
              };
              startWatch();

              const reload = func_throttle(() => {
                console.log('page reload!');
                ws.send({
                  type: 'full-reload',
                  // path: '*' 告诉 Vite 客户端重新加载整个页面
                  // 可以具体指定路径，但对于 Eleventy 集成，'*' 通常更合适
                  path: '*',
                });
              }, 200);

              ws.on('close', () => {
                return watcher?.close();
              });
            },
            resolveId(source, importer, options) {
              let bundle_filename: string | undefined;
              if (source.startsWith('/bundle/')) {
                bundle_filename = path.resolve(bundleDir, source.slice('/bundle/'.length));
              }
              if (source.startsWith('.') && importer?.startsWith('/bundle/')) {
                bundle_filename = path.resolve(bundleDir, importer.slice('/bundle/'.length), '../', source);
              }
              if (bundle_filename) {
                const moduleId = getModuleId(bundle_filename);
                return moduleId;
              }
            },
            load(moduleId, _options) {
              if (moduleId.startsWith('/bundle/')) {
                const bundle_filename = path.resolve(bundleDir, moduleId.slice('/bundle/'.length));
                return fs.readFileSync(bundle_filename, 'utf-8');
              }
            },
          } satisfies PluginOption;
        })(),
      ],
    } satisfies ViteUserConfig,
  });
  eleventyConfig.setServerPassthroughCopyBehavior('copy');
  // eleventyConfig.addPassthroughCopy('bundle');
  eleventyConfig.addPassthroughCopy({'imgs/logo.webp': 'favicon.ico'});
  eleventyConfig.addPassthroughCopy('components');
  eleventyConfig.addPassthroughCopy('docs-src/css');
  eleventyConfig.addPassthroughCopy('docs-src/.nojekyll');
  eleventyConfig.addPassthroughCopy('docs-src/components');
  eleventyConfig.addPassthroughCopy('docs-src/public');
  // eleventyConfig.addPassthroughCopy({'node_modules/@webcomponents/webcomponentsjs': 'public/webcomponentsjs'});
  eleventyConfig.addPassthroughCopy({'node_modules/prismjs/themes': 'prismjs'});
  eleventyConfig.addPassthroughCopy('imgs');
  eleventyConfig.addPassthroughCopy('node_modules/lit/polyfill-support.js');
  eleventyConfig.ignores.delete('README.md');
  // eleventyConfig.addWatchTarget('bundle');
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
