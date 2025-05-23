import {css} from 'lit';

export const translucentStyle = css`
  :host {
    background-color: var(--color-canvas);
  }
  :host([data-translucent='yes']) {
    background-color: transparent;
    --_light-brightness: calc(1.5 * var(--color-scheme-light, 1)); /* 1=default */
    --_dark-brightness: calc(0.5 * var(--color-scheme-dark, 0));
    backdrop-filter: blur(20px) contrast(0.5) brightness(max(var(--_light-brightness), var(--_dark-brightness)));
  }
`;
