import {css} from 'lit';

export const appnNavigationStyle = css`
  :host {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'stack';
  }
  ::slotted(*) {
    grid-area: stack;
    z-index: 1;
  }
  slot[name='router'] {
    display: none;
  }
`;
