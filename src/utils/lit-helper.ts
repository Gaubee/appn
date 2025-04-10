import type {Properties} from 'csstype';
import {unsafeCSS} from 'lit';

/**
 * 用于包裹 CSS 字面量
 * 这样包一层，可以规避 minify-literals: unsafeCSS() detected in source. CSS minification will not be performed for this file.
 * @see {@link https://github.com/explodingcamera/esm/blob/main/packages/minify-literals/lib/index.ts#L271}
 */
export const cssLiteral = (literal: Properties[keyof Properties] | (string & {})) => {
  return unsafeCSS(literal);
};
