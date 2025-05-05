import {func_lazy, map_get_or_put, math_clamp} from '@gaubee/util';
import {match, P} from 'ts-pattern';
import type {CssColorMix} from './css-color-mix-type';

export const calc_color_mix_shim_rgba: CssColorMix = func_lazy(() => {
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

import {
  formatCss,
  interpolateWithPremultipliedAlpha,
  type Mode,
  modeA98,
  modeHsl,
  modeHwb,
  modeLab,
  modeLch,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeP3,
  modeProphoto,
  modeRec2020,
  modeRgb,
  modeXyz50,
  modeXyz65,
  useMode,
} from 'culori/fn';
export const calc_color_mix_shim: CssColorMix = func_lazy(() => {
  useMode(modeRgb);
  useMode(modeLrgb);
  useMode(modeHsl);
  useMode(modeRec2020);
  useMode(modeLab);
  useMode(modeOklab);
  useMode(modeLch);
  useMode(modeOklch);
  useMode(modeHwb);
  useMode(modeP3);
  useMode(modeProphoto);
  useMode(modeXyz65);
  useMode(modeXyz50);
  useMode(modeA98);
  return (colorSpace, c1, c2, p1, p2) => {
    // 百分比归一化 (根据 CSS Color 5 § 3.1)
    const ps: {
      /** 插值因子，代表 p2_norm */
      t: number;
      alpha?: number;
    } = match({p1, p2})
      // 规则 2: 都省略，默认为 50%
      .with({p1: P.nullish, p2: P.nullish}, () => ({t: 0.5}))
      // 规则 3: p2 省略
      .with({p1: P.number, p2: P.nullish}, (ps) => {
        return {t: math_clamp(ps.p1, 0, 1) / 1};
      })
      // 规则 4: p1 省略
      .with({p1: P.nullish, p2: P.number}, (ps) => {
        return {t: math_clamp(ps.p2, 0, 1)};
      })
      // 规则 5 & 6: p1 和 p2 都提供
      .with({p1: P.number, p2: P.number}, (ps) => {
        const sum = ps.p1 + ps.p2;
        if (sum === 0) {
          // §3.2 步骤 1: 如果 alpha 乘数为 0，结果是透明的
          // 返回目标色彩空间的透明色 (这里简化为 CSS transparent)
          // 注意：规范说 'transparent', converted to the specified interpolation <color-space>
          return {t: 0.5, alpha: 0};
        }
        return {t: ps.p2 / sum, alpha: sum < 1 ? sum : 1};
      })
      .exhaustive();

    // colorSpace: 'srgb' | 'srgb-linear' | 'display-p3' | 'a98-rgb' | 'prophoto-rgb' | 'rec2020' | 'lab' | 'oklab' | 'xyz' | 'xyz-d50' | 'xyz-d65'
    const mode: Mode = match(colorSpace)
      .with('srgb', () => 'rgb' as const)
      .with('srgb-linear', () => 'lrgb' as const)
      .with('hsl', 'rec2020', 'lab', 'oklab', 'lch', 'oklch', 'hwb', (v) => v)
      .with('display-p3', () => 'p3' as const)
      .with('prophoto-rgb', () => 'prophoto' as const)
      .with('a98-rgb', () => 'a98' as const)
      .with('xyz', 'xyz-d65', () => 'xyz65' as const)
      .with('xyz-d50', () => 'xyz50' as const)
      .otherwise(() => 'rgb' as const);

    if (ps.alpha === 0) {
      return 'transparent';
    }

    const mixedColorObject = interpolateWithPremultipliedAlpha([c1, c2], mode)(ps.t);
    if (ps.alpha != null && ps.alpha !== 1) {
      mixedColorObject.alpha = math_clamp((mixedColorObject.alpha ?? 1) * ps.alpha, 0, 1);
    }

    return formatCss(mixedColorObject);
  };
});
