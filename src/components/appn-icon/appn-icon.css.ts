import {css} from 'lit';

export const appnIconStyle = [
  css`
    :host {
      display: inline-flex;
      min-width: 1em;
      min-height: 1em;
      line-height: 1;
      box-sizing: border-box;
      padding: 0.15em;
      align-self: center;
      object-fit: contain;
    }
    svg {
      flex: 1;
    }
  `,
];
