import {css, LitElement, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('css-starting-style')
export class CssStartingStyleElement extends LitElement {
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
  #uuid = crypto.randomUUID().replace(/^[0-9a-f]+\-[0-9a-f]+/, 'starting-style');

  @property({type: String, attribute: true, reflect: true})
  accessor selector: string = '';
  @property({type: String, attribute: true, reflect: true})
  accessor layer: string = '';
  @property({type: String, attribute: true, reflect: true})
  accessor cssText: string = '';

  private __styleEle = document.createElement('style');

  #lastparent: HTMLElement | null = null;
  override connectedCallback() {
    super.connectedCallback();
    const targetElement = this.parentElement;
    if (targetElement == null) {
      return;
    }
    targetElement.setAttribute(this.#uuid, '');
    this.#lastparent = targetElement;

    // const cssRule = new CSSStyleSheet();
    // cssRule.replaceSync(`:host{${this.cssText}}`);
    // const csr = cssRule.cssRules.item(0) as CSSStyleRule;
    // const style: PropertyIndexedKeyframes = {
    //   //   composite: 'accumulate',
    // };
    // for (const key of csr.styleMap.keys()) {
    //   style[key.replace(/-[a-z]/g, (c) => c[1].toUpperCase())] = csr.style.getPropertyValue(key);
    // }
    // console.log('QAQ style', style);
    // // cssRule.stle
    // const animation = targetElement.animate(style, {
    //   duration: 0, // 动画时长为 0，立即完成
    //   fill: 'forwards', // 动画结束后保持最终状态
    //   // composite: 'replace' // (默认) 替换现有动画/样式效果
    // });
    // console.log('QAQ animation', animation);
    // animation.commitStyles();
    // animation.cancel();

    this.appendChild(this.__styleEle);
    requestAnimationFrame(() => {
      this.removeChild(this.__styleEle);
    });
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#lastparent?.removeAttribute(this.#uuid);
  }

  protected override updated(_changedProperties: PropertyValues): void {
    const {cssText, layer} = this;
    let css = `${this.selector}[${this.#uuid}]{${cssText}}`;
    if (layer) {
      css = `@layer ${layer}{${css}}`;
    }
    this.__styleEle.innerHTML = css;

    super.updated(_changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'css-starting-style': CssStartingStyleElement;
  }
}
