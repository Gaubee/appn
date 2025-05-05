export const caniuseColorMix = CSS.supports('color:color-mix(in srgb,#000,#000)');
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
  (colorSpace: ColorSpace, c1: string, c2: string, p1?: number | null, p2?: number | null): string;
};
export type ColorSpace = 'srgb' | 'srgb-linear' | 'display-p3' | 'a98-rgb' | 'prophoto-rgb' | 'rec2020' | 'lab' | 'hwb' | 'oklab' | 'xyz' | 'xyz-d50' | 'xyz-d65' | (string & {});
