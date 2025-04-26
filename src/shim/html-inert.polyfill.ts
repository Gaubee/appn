import {getAdoptedStyleSheets} from '../utils/css-helper';

if ('inert' in document.documentElement) {
  const css = String.raw;
  const cssSheet = new CSSStyleSheet();
  cssSheet.replace(css`
    [inert] {
      pointer-events: none;
      cursor: default;
    }

    [inert],
    [inert] * {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  `);
  getAdoptedStyleSheets(document).push(cssSheet);

  Object.defineProperty(HTMLElement.prototype, 'inert', {
    enumerable: true,
    get: function (this: HTMLElement) {
      return this.hasAttribute('inert');
    },
    set: function (this: HTMLElement, inert) {
      if (inert) {
        this.setAttribute('inert', '');
        this.ariaHidden = 'true';
      } else {
        this.removeAttribute('inert');
        this.setAttribute('aria-hidden', 'true');
        this.ariaHidden = null;
      }
    },
  });
}
