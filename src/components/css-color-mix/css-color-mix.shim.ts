import {map_get_or_put} from '@gaubee/util';

const canvas_cache = new Map<string, CanvasRenderingContext2D>();
export const getCanvasCtx = (displayColor: string) =>
  map_get_or_put(canvas_cache, displayColor, () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;

    const ctx = canvas.getContext('2d', {
      displayColor,
      willReadFrequently: true, // 提示浏览器优化 getImageData
    });
    return ctx as CanvasRenderingContext2D;
  });

export const calcMixColor = (ctx: CanvasRenderingContext2D, c1: string, c2: string, p1: number, _p2: number) => {
  const x0 = -p1;
  const x1 = 100 - p1;
  const gradient = ctx.createLinearGradient(x0, 0, x1, 0); // 水平渐变

  // 添加颜色停止点
  gradient.addColorStop(0, c1); // 对应逻辑位置 x0
  gradient.addColorStop(1, c2); // 对应逻辑位置 x1

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 1); // 在 (0,0) 绘制一个像素，使用渐变颜色

  const imageData = ctx.getImageData(0, 0, 1, 1).data;

  const [r, g, b, a] = imageData;
  return `rgb(${r},${g},${b},${a / 255})`;
};
