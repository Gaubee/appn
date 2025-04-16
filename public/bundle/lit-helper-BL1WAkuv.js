import { c as r } from './custom-element-T1yNbIOj.js';

/**
 * 用于包裹 CSS 字面量
 * 这样包一层，可以规避 minify-literals: unsafeCSS() detected in source. CSS minification will not be performed for this file.
 * @see {@link https://github.com/explodingcamera/esm/blob/main/packages/minify-literals/lib/index.ts#L271}
 */
const cssLiteral = (literal) => {
    return r(literal);
};

export { cssLiteral as c };
