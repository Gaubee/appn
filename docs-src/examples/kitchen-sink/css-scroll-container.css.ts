const css = String.raw;
export const styleText = [
  css`
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    @layer support, demo;

    @layer support {
      :root {
        --surface-1: light-dark(oklch(80% 10% 250), oklch(10% 5% 250));
        --surface-2: light-dark(oklch(90% 7% 250), oklch(20% 5% 250));
        --surface-3: light-dark(oklch(100% 8% 250), oklch(30% 5% 250));
        --text-1: light-dark(oklch(10% 5% 250), oklch(90% 5% 250));
        --text-2: light-dark(oklch(20% 5% 250), oklch(80% 5% 250));
      }
      .scroll-container {
        background: radial-gradient(circle in oklab, var(--surface-2), var(--surface-1)) fixed;
        color: var(--text-1);

        inline-size: 30ch;
        block-size: 11rlh;

        overscroll-behavior: contain;
      }

      .scroller {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;

        > .item {
          padding: 10px 15px;
          background: var(--surface-3);
        }
      }

      section {
        display: flex;
        flex-flow: column;
        gap: 0.5em;
        justify-items: start;
        margin-bottom: 2em;

        > header {
          display: grid;
          place-content: center start;
          gap: 10px;

          > p {
            text-wrap: balance;
            max-inline-size: 30ch;
            color: var(--text-2);
          }
        }
      }
    }
  `,
  css`
    @layer demo {
      /* Example 1: opacity variables for animating */
      @property --_scroll-shadow-color-1-opacity {
        syntax: '<percentage>';
        inherits: false;
        initial-value: 0%;
      }

      @property --_scroll-shadow-color-2-opacity {
        syntax: '<percentage>';
        inherits: false;
        initial-value: 0%;
      }

      #example-1 .scroll-container {
        /* notice size added too, makes 100cqh contextual for the shadows */
        container-type: scroll-state size;
        overflow: auto;
        display: grid;

        > * {
          grid-area: 1/1;
        }

        /* pseudos of a container-type can query the container */
        &::after {
          content: ' ';
          grid-area: 1/1;
          display: block;
          position: sticky;
          top: 0;
          height: 100cqh;
          width: 100%;
          pointer-events: none;

          /* background props ready for scroll-state to flip on/off */
          background: var(--_shadow-top), var(--_shadow-bottom);
          transition:
            --_scroll-shadow-color-1-opacity 0.5s ease,
            --_scroll-shadow-color-2-opacity 0.5s ease;

          /* derive shadow from background */
          --_scroll-shadow-color-1: oklch(from var(--surface-1) 10% calc(c * 2) h / var(--_scroll-shadow-color-1-opacity));
          --_scroll-shadow-color-2: oklch(from var(--surface-1) 10% calc(c * 2) h / var(--_scroll-shadow-color-2-opacity));

          /* define top and bottom gradient shadow effects */
          --_shadow-top: linear-gradient(to bottom, var(--_scroll-shadow-color-1), #0000 20px);
          --_shadow-bottom: linear-gradient(to top, var(--_scroll-shadow-color-2), #0000 20px);

          @media (prefers-color-scheme: dark) {
            --_shadow-color-opacity: 90%;
          }

          @container scroll-state(scrollable: top) {
            --_scroll-shadow-color-1-opacity: var(--_shadow-color-opacity, 25%);
          }

          @container scroll-state(scrollable: bottom) {
            --_scroll-shadow-color-2-opacity: var(--_shadow-color-opacity, 25%);
          }
        }
      }
    }
  `,
  css`
    @layer demo {
      #example-2 .scroll-container {
        /* notice size added too, makes 100cqh contextual for the shadows */
        overflow: auto;
        display: flex;
        flex-direction: column;

        .stuck-top {
          position: sticky;
          container-type: scroll-state;
          top: 0;
          z-index: 2;

          * {
            background: #f006;
            @container scroll-state(stuck: top) {
              background: #00f6;
            }
            @container scroll-state(stuck: bottom) {
              background: #0f06;
            }
          }
        }
        .stuck-bottom {
          position: sticky;
          container-type: scroll-state;
          bottom: 0;
          z-index: 2;

          * {
            background: #f006;
            @container scroll-state(stuck: top) {
              background: #00f6;
            }
            @container scroll-state(stuck: bottom) {
              background: #0f06;
            }
          }
        }
      }
    }
  `,
].join('');
