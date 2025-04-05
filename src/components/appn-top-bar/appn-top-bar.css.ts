import {css} from 'lit';
CSS.registerProperty({
  name: '--title-clamp',
  syntax: '<integer>',
  inherits: false,
  initialValue: '1',
});
export const appnTopBarStyle = css`
  :host {
    display: flex;
    flex-direction: row;
    align-items: baseline; /** 使用 baseline 而不是 center，确保即便 title 多行， leading 也能保持在原本的位置 */
    padding-left: var(--safe-area-inset-left, 0px);
    padding-right: var(--safe-area-inset-right, 0px);
  }
  .leading {
    flex-shrink: 0;
    min-width: 48px;
  }
  .title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--title-clamp, 1);
    height: 2em;
    line-height: 1.8;

    font-weight: 600;
  }

  .actions {
    flex-shrink: 0;
    min-width: 48px;
  }
`;
