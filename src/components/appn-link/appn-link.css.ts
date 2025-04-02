import {css} from 'lit';

CSS.registerProperty({
  name: '--_link-halo-angle',
  syntax: '<angle>',
  inherits: true,
  initialValue: '0deg',
});

export const appnLinkStyle = css`
  :host {
    display: contents;
  }
  button {
    font: var(--font);
    color: var(--color-accent);
    background: none;
    border: none;
    padding: 0.45em 0.75em;
    border-radius: 0.75em;
    cursor: pointer;
    position: relative;

    box-shadow: 0px 1px 5px -3px var(--color-canvas-text);

    transition-property: all;
    transition-duration: 300ms;
    transition-timing-function: ease-out;

    --_link-halo-angle: 36deg;
  }
  /** 光影效果 */
  button::before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    border-radius: calc(0.5em);
    padding: 1px;
    background: linear-gradient(var(--_link-halo-angle), var(--color-accent), rgb(0 0 0 / 50%), #fff);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    box-sizing: border-box;
    opacity: 0.5;

    transition-property: --_link-halo-angle;
    transition-duration: 500ms;
    transition-timing-function: ease-out;
  }
  button:not(:disabled):hover {
    transition-duration: 100ms;
    box-shadow: 0px 1px 4px -2px var(--color-canvas-text);
    --_link-halo-angle: 180deg;
  }
  button:not(:disabled):active {
    transition-duration: 100ms;
    box-shadow: 0px 0px 3px -1px var(--color-canvas-text);
    transform: translateY(1px);
    --_link-halo-angle: 318deg;
  }
  button:not(:disabled):focus-within:focus-visible {
    transition-duration: 100ms;
    box-shadow: 0px 1px 4px -2px var(--color-canvas-text);
  }
  button:disabled {
    filter: grayscale(0.5) contrast(0.5);
    cursor: not-allowed;
  }

  a {
    font: var(--font);
    color: var(--color-accent);
    text-decoration: none;
    cursor: pointer;

    text-decoration: underline 1px transparent;
    text-underline-offset: 0.3em;

    transition-property: text-decoration-color, text-underline-offset;
    transition-duration: 300ms;
    transition-timing-function: ease-out;
  }
  a:hover,
  a:target {
    transition-duration: 100ms;
    text-decoration-color: currentColor;
    text-underline-offset: 0.1em;
  }
`;
