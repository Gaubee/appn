import {css} from 'lit';
import { appnNavTitleStyle } from '../appn-top-bar/appn-top-bar.css';

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
  .link {
    display: inline-flex;
    flex-direction: row;
    /**这里不好不用baseline，因为会有shared-element，它在shared模式下，baseline没有文字就无法生效 */
    align-items: center;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
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

    transition-property: all;
    transition-duration: var(--common-leave-duration);
    transition-timing-function: var(--common-leave-ease);
  }
  .a {
    text-decoration: underline 1px transparent;
    text-underline-offset: 0.3em;

    /* transition-property: text-decoration-color, text-underline-offset;
    transition-duration: var(--common-leave-duration);
    transition-timing-function: var(--common-leave-ease); */
  }
  .a:hover,
  .a:target {
    transition-duration: 100ms;
    text-decoration-color: currentColor;
    text-underline-offset: 0.1em;
  }

  .text-button:active {
    opacity: 0.5;
    transition-property: all;
    transition-duration: var(--common-enter-duration);
    transition-timing-function: var(--common-enter-ease);
  }
`;

export const appnNavBackTextStyle = appnNavTitleStyle;
export const appnNavTextStyle = appnNavTitleStyle;