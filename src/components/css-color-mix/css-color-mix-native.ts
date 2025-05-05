import type {CssColorMix} from './css-color-mix-type';

export const calc_color_mix_native: CssColorMix = (colorSpace, c1, c2, p1, p2) => {
  return `color-mix(in ${colorSpace}, ${c1} ${p1 != null ? p1 * 100 + '%' : ''}, ${c2} ${p2 != null ? p2 * 100 + '%' : ''})`;
};
