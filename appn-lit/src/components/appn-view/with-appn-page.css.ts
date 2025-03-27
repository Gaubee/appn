import {css} from 'lit';

export const appnViewWithAppnPageStyle = css`
  ::slotted(appn-view) {
    padding-left: var(--safe-area-inset-left, 0px);
    padding-right: var(--safe-area-inset-right, 0px);
  }
`;
