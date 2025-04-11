import {map_get_or_put, obj_props} from '@gaubee/util';
import type {AdoptedStyleSheets} from '@gaubee/web';
import {createAdoptedStyleSheets} from '@gaubee/web';
import type {Properties} from 'csstype';
/**
 * Converts a JS style object (camelCase or kebab-case) to a CSS text string.
 * Handles CSS custom properties (variables).
 * @param styleProperties - The style object.
 * @returns A string of CSS rules.
 * @example
 *
 * ```ts
 * styleToCss({ backgroundColor: 'red', '--my-var': 'blue', fontSize: '16px' })
 * Returns "background-color:red;--my-var:blue;font-size:16px;"
 * ```
 */
export const styleToCss = (styleProperties: Properties) => {
  let css = '';
  for (const key of obj_props(styleProperties)) {
    const css_property = key.startsWith('--') ? key : key.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
    css += `${css_property}:${styleProperties[key]};`;
  }
  return css;
};

export type CssStyleProperty = {
  [key in keyof CSSStyleDeclaration]: CSSStyleDeclaration[key] extends string ? key : never;
}[keyof CSSStyleDeclaration];
export const getDocument = (element: Node | null): Document => {
  if (!element) {
    return document; // Default fallback
  }
  return element.nodeType !== Node.DOCUMENT_NODE
    ? // use its owner document or fallback to the global document.
      (element.ownerDocument ?? document)
    : (element as Document);
};
const ass_wn = new WeakMap<DocumentOrShadowRoot, AdoptedStyleSheets>();
export const getAdoptedStyleSheets = (ele: Element | DocumentOrShadowRoot) => {
  if (!('adoptedStyleSheets' in ele)) {
    ele = getDocument(ele);
  }
  return map_get_or_put(ass_wn, ele, createAdoptedStyleSheets);
};

export const isSupportCssLayer = /*@__PURE__*/ typeof CSSLayerBlockRule === 'function' && typeof CSSLayerStatementRule === 'function';
