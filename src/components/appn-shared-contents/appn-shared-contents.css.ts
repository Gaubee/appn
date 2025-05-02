import {css} from 'lit';

export const appnSharedStyle = css`
  :host {
    display: block;
    position: relative;
    isolation: isolate;
  }
  dialog {
    padding: 0;
    margin: 0;
    border: 0;

    position: static;
    color: inherit;
  }
  dialog::backdrop {
    background: transparent;
  }
`;
