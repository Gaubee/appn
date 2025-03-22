import fsp from 'fs/promises';
import path from 'path';
const rootDir = path.resolve(import.meta.dirname, '..');
const docsDir = path.resolve(rootDir, 'docs');

async function copyAssets() {
  const sourceFiles = (
    ['node_modules/prismjs/themes/prism-okaidia.css'] as Array<
      string | {src: string; dest: string}
    >
  ).map((task) => {
    if (typeof task === 'string') {
      return {src: task, dest: path.basename(task)};
    }
    return task;
  });
  sourceFiles.forEach((task) => {
    task.src = path.join(rootDir, task.src);
    task.dest = path.join(docsDir, task.dest);
  });

  for (const task of sourceFiles) {
    try {
      await fsp.mkdir(path.dirname(task.dest), {recursive: true});
      await fsp.copyFile(task.src, task.dest);
      console.log(`✓ 成功复制 ${path.basename(task.dest)} 到 docs 目录`);
    } catch (error) {
      console.error('复制文件时发生错误:', error);
    }
  }
}

copyAssets();
