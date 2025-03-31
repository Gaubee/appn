import {css} from 'lit';

export const appnLinkStyle = css`
  :host {
    display: contents;
  }
  button {
    font: var(--font);
    background-color: var(--color-accent);
    color: var(--color-accent-text);
    border: 1px solid var(--color-accent);
    padding: 0.25em 0.75em;
    border-radius: 0.5em;
    cursor: pointer;

    box-shadow: 0px 1px 3px -2px var(--color-canvas-text); // 1px border + 1px padding = 2p

    transition-property: box-shadow;
    transition-duration: 300ms;
    transition-timing-function: ease-out;
  }
  button:hover,
  button:focus-within {
    box-shadow: 0px 1px 4px -1px var(--color-canvas-text); // 1px border + 1px padding = 2p
  }

  a {
    font: var(--font);
    color: var(--color-accent);
    text-shadow:
      1px 1px 2px var(--color-accent-text),
      -1px 1px 2px var(--color-accent-text);
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
    text-decoration-color: currentColor;
    text-underline-offset: 0.1em;
  }
`;
