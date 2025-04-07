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
    padding-left: calc(var(--safe-area-inset-left, 0px) * 0.5);
    padding-right: calc(var(--safe-area-inset-right, 0px) * 0.5);
  }
  .leading {
    flex-shrink: 0;
    min-width: 48px;
    anchor-name: --leading;
    user-select: none;
  }
  #nav-history {
    position-anchor: --leading;
    left: anchor(left);
    top: anchor(top);
    margin: 0;

    backdrop-filter: blur(20px) contrast(0.5) brightness(max(var(--_light-brightness), var(--_dark-brightness)));

    width: max-content;
    min-width: 60cqw;
    padding: 0;
    flex-direction: column;
    border-radius: var(--grid-unit);
    background: unset;
    border: unset;
    color: var(--color-canvas-text);
    box-shadow: 0 0 calc(var(--grid-unit) * 4) 0 color-mix(in srgb, var(--color-canvas-text), transparent 80%);

    transition-property: all;
    transition-duration: var(--menu-leave-duration);
    transition-timing-function: var(--menu-leave-ease);
    transform-origin: top left;
    @starting-style {
      scale: 0.5;
      opacity: 0;
    }
  }
  #nav-history li {
    list-style: none;
  }
  #nav-history appn-link::part(link) {
    padding: var(--grid-unit);
  }
  #nav-history hr {
    all: unset;
    height: var(--dpx);
    width: 100%;
    background-color: var(--color-canvas-text);
    opacity: 0.5;
  }
  #nav-history hr:last-child {
    display: none;
  }
  #nav-history:popover-open {
    display: flex;
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
