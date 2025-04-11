import {css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {match} from 'ts-pattern';
import {safeProperty} from '../../utils/safe-property';
import {enumToSafeConverter} from '../../utils/safe-property/enum-to-safe-converter';

const CSS_STARTING_STYLE_MODE_ENUM_VALUES = ['auto', 'native', 'shim'] as const;
export type CssStartingStyleMode = (typeof CSS_STARTING_STYLE_MODE_ENUM_VALUES)[number];
@customElement('css-starting-style')
export class CssStartingStyleElement extends LitElement {
  static readonly isSupports = typeof CSSStartingStyleRule === 'function';
  static override readonly shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    mode: 'closed' as const,
  };
  //   static readonly css_starting_style = css_starting_style;
  //   static readonly css_starting_style_native = css_starting_style_native;
  //   static readonly css_starting_style_shim = css_starting_style_shim;
  static override styles = css`
    :host {
      display: none;
    }
  `;
  @safeProperty(enumToSafeConverter(CSS_STARTING_STYLE_MODE_ENUM_VALUES))
  accessor mode: CssStartingStyleMode = 'auto';

  @property({type: String, attribute: true, reflect: true})
  accessor selector: string = '';
  @property({type: String, attribute: true, reflect: true})
  accessor layer: string = '';
  @property({type: String, attribute: true, reflect: true})
  accessor cssText: string = '';

  private __styleEle = document.createElement('style');
  constructor() {
    super();
    this.append(this.__styleEle);
  }

  private __watcher = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node instanceof Element) {
          node.matches(this.selector);
          node.setAttribute('css-starting-style-hook', '');
          requestAnimationFrame(() => {
            node.removeAttribute('css-starting-style-hook');
          });
        }
      }
      for (const node of m.removedNodes) {
        if (node instanceof Element) {
          node.removeAttribute('css-starting-style-hook');
        }
      }
    }
  });
  private __watched = false;
  private __effect_watch(watch: boolean) {
    if (watch) {
      if (!this.__watched && this.__root) {
        this.__watched = true;
        this.__watcher.observe(this.__root, {childList: true, subtree: true});
      }
    } else {
      if (this.__watched) {
        this.__watched = false;
        this.__watcher.disconnect();
      }
    }
  }

  private __root: ShadowRoot | Document | null = null;
  override connectedCallback(): void {
    super.connectedCallback();
    const root = this.getRootNode();
    if ('querySelector' in root) {
      this.__root = root as ShadowRoot | Document;
    }
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.__effect_watch(false);
    this.__root = null;
  }
  override render() {
    const {mode, cssText, layer} = this;
    const useMode = mode === 'auto' ? (CssStartingStyleElement.isSupports ? ('native' as const) : ('shim' as const)) : mode;
    this.dataset.mode = useMode;

    let ruleText = match(useMode)
      .with('native', () => {
        this.__effect_watch(false);
        return `@starting-style{${this.selector}{${cssText}}}`;
      })
      .with('shim', () => {
        this.__effect_watch(true);
        return `${this.selector}[css-starting-style-hook]{${cssText}}`;
      })
      .exhaustive();
    if (layer) {
      ruleText = `@layer ${layer}{${ruleText}}`;
    }
    this.__styleEle.innerHTML = ruleText;
  }
}

@customElement('css-starting-hook')
export class CssStartingHookElement extends LitElement {
  static override styles = css`
    :host {
      display: none;
    }
  `;

  #target: HTMLElement | null = null;
  #raf_id: number = 0;
  override connectedCallback() {
    super.connectedCallback();
    const target = this.parentElement;
    if (!target) {
      return;
    }
    this.#target = target;

    target.setAttribute('css-starting-style-hook', '');
    this.#raf_id = requestAnimationFrame(() => {
      target.removeAttribute('css-starting-style-hook');
    });
  }
  override disconnectedCallback() {
    super.disconnectedCallback();

    const target = this.#target;
    if (target) {
      this.#target = null;
      target.removeAttribute('css-starting-style-hook');
      this.#raf_id && cancelAnimationFrame(this.#raf_id);
    }
  }

  protected override render() {
    // this.dataset.enable = String(this.enabled);
    return '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'css-starting-style': CssStartingStyleElement;
    'css-starting-hook': CssStartingHookElement;
  }
}
