import {css} from 'lit';
import {fixedSharedInnerStyle} from './appn-shared-contents-helper';

export const appnSharedStyle = [
  css`
    :host {
      display: block;
    }
  `,
  fixedSharedInnerStyle,
];
