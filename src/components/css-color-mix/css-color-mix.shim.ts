import {func_lazy, map_get_or_put} from '@gaubee/util';
import {match, P} from 'ts-pattern';

export type CssColorMix = {
  /**
   * 混合两个颜色，返回混合后的颜色
   * @param colorSpace 色彩空间
   * @param c1 第一个颜色
   * @param c2 第二个颜色
   * @param p1 第一个颜色的权重，取值范围 0-1，默认为 0.5
   * @param p2 第二个颜色的权重，取值范围 0-1，默认为 0.5
   * @returns 混合后的颜色
   */
  (colorSpace: string, c1: string, c2: string, p1?: number | null, p2?: number | null): string;
};
const css_color_mix_native: CssColorMix = (colorSpace, c1, c2, p1, p2) => {
  return `color-mix(in ${colorSpace}, ${c1} ${p1 ? p1 * 100 + '%' : ''}, ${c2} ${p2 ? p2 * 100 + '%' : ''})`;
};

const css_color_mix_shim: CssColorMix = func_lazy(() => {
  const canvas_cache = new Map<string, CanvasRenderingContext2D>();
  const getCanvasCtx = (displayColor: string) =>
    map_get_or_put(canvas_cache, displayColor, () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;

      const ctx = canvas.getContext('2d', {
        displayColor,
        willReadFrequently: true, // 提示浏览器优化 getImageData
      });
      return ctx as CanvasRenderingContext2D;
    });

  const calcMixColor = (ctx: CanvasRenderingContext2D, c1: string, c2: string, p1: number, p2: number) => {
    const gradient = ctx.createLinearGradient(-p1, 0, p2, 0); // 水平渐变

    // 添加颜色停止点
    gradient.addColorStop(0, c1); // 对应逻辑位置 x0
    gradient.addColorStop(1, c2); // 对应逻辑位置 x1

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 1); // 在 (0,0) 绘制一个像素，使用渐变颜色

    const imageData = ctx.getImageData(0, 0, 1, 1).data;

    const [r, g, b, a] = imageData;
    return `rgb(${r},${g},${b},${a / 255})`;
  };
  return (colorSpace, c1, c2, p1, p2) => {
    const ctx = getCanvasCtx(colorSpace);
    const ps = match({p1, p2})
      .with({p1: P.nullish, p2: P.nullish}, () => ({p1: 50, p2: 50}))
      .with({p1: P.nullish, p2: P.number}, (ps) => {
        const p2 = ps.p2 * 100;
        return {p1: 100 - p2, p2};
      })
      .with({p1: P.number, p2: P.nullish}, (ps) => {
        const p1 = ps.p1 * 100;
        return {p1, p2: 100 - p1};
      })
      .with({p1: P.number, p2: P.number}, (ps) => ({p1: ps.p1 * 100, p2: ps.p2 * 100}))
      .exhaustive();
    return calcMixColor(ctx, c1, c2, ps.p1, ps.p2);
  };
});

export const css_color_mix = CSS.supports('color:color-mix(in srgb,#000,#000)') ? css_color_mix_native : css_color_mix_shim;
