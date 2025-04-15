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
  .back-button {
    view-transition-name: appn-top-bar-back-button;
  }
  #nav-history {
    position-anchor: --leading;
    left: anchor(left);
    top: anchor(top);
    margin: 0;

    backdrop-filter: blur(20px) contrast(0.5) brightness(max(var(--_light-brightness), var(--_dark-brightness)));

    width: max-content;
    max-height: calc(100cqh - var(--safe-area-inset-top) - var(--safe-area-inset-bottom));
    min-width: 60cqw;
    padding: 0;
    flex-direction: column;
    border-radius: var(--grid-unit);
    background: unset;
    border: unset;
    color: var(--color-canvas-text);
    box-shadow: 0 0 calc(var(--grid-unit) * 4) 0 color-mix(in srgb, var(--color-canvas-text), transparent 80%);

    transition-property: all;
    transition-behavior: allow-discrete;
    transition-duration: var(--menu-leave-duration);
    transition-timing-function: var(--menu-leave-ease);
    transform-origin: top left;
  }
  #nav-history li {
    list-style: none;
    transition-duration: var(--common-leave-duration);
    transition-timing-function: var(--common-leave-ease);
  }
  #nav-history li:hover {
    transition-duration: var(--common-enter-duration);
    transition-timing-function: var(--common-enter-ease);
    background-color: color-mix(in srgb, var(--color-canvas), transparent 50%);
  }
  #nav-history appn-link::part(link) {
    padding: var(--grid-unit) calc(var(--grid-unit) * 1.5);
    width: 100%;
  }
  #nav-history hr {
    all: unset;
    height: var(--dpx);
    width: 100%;
    background-color: var(--color-canvas-text);
    opacity: 0.2;
  }
  #nav-history hr:last-child {
    display: none;
  }
  #nav-history:popover-open {
    display: flex;
    transition-duration: var(--menu-enter-duration);
    transition-timing-function: var(--menu-enter-ease);
    @starting-style {
      scale: 0.5;
      opacity: 0.5;
      box-shadow: 0 0 0 0 transparent;
    }
  }
  #nav-history:not(:popover-open) {
    scale: 0.5;
    opacity: 0;
    box-shadow: 0 0 0 0 transparent;
    pointer-events: none;
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
    view-transition-class: appn-top-bar-title;
  }

  ::view-transition-group(.appn-top-bar-title) {
    /* animation-timing-function: ease-in-out; */
    transition-duration: var(--page-enter-duration);
    transition-timing-function: var(--page-enter-ease);
  }
  .actions {
    flex-shrink: 0;
    min-width: 48px;
  }
`;
