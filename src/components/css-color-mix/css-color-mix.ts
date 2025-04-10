import type {Property} from 'csstype';
import {css, LitElement, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {safeProperty} from '../../utils/safe-property';
import {percentageToSafeConverter} from '../../utils/safe-property/range-to-safe-converter';
import {css_color_mix, css_color_mix_native, css_color_mix_shim} from './css-color-mix.shim';
export type ColorSpace = 'srgb' | 'srgb-linear' | 'display-p3' | 'a98-rgb' | 'prophoto-rgb' | 'rec2020' | 'lab' | 'hwb' | 'oklab' | 'xyz' | 'xyz-d50' | 'xyz-d65' | (string & {});

@customElement('css-color-mix')
export class CssColorMixElement extends LitElement {
  static override readonly shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    mode: 'closed' as const,
  };
  static readonly css_color_mix = css_color_mix;
  static readonly css_color_mix_native = css_color_mix_native;
  static readonly css_color_mix_shim = css_color_mix_shim;
  static override styles = css`
    :host {
      display: none;
    }
  `;
  @property({type: String, reflect: true, attribute: true})
  accessor var: ColorSpace = '--color-mix';
  @property({type: String, reflect: true, attribute: true})
  accessor in: string = 'srgb';
  @property({type: String, reflect: true, attribute: true})
  accessor c1: Property.Color = '#000';
  @safeProperty(percentageToSafeConverter)
  accessor p1: number | null = null;
  @property({type: String, reflect: true, attribute: true})
  accessor c2: Property.Color = '#000';
  @safeProperty(percentageToSafeConverter)
  accessor p2: number | null = null;

  private __styleEle = document.createElement('style');
  constructor() {
    super();
    this.appendChild(this.__styleEle);
  }

  protected override updated(_changedProperties: PropertyValues): void {
    let color1 = this.c1;
    let color2 = this.c2;
    const color1_is_css_var = color1.startsWith('--');
    const color2_is_css_var = color2.startsWith('--');
    if (color1_is_css_var || color2_is_css_var) {
      const styles = getComputedStyle(this);
      color1 = color1_is_css_var ? styles.getPropertyValue(color1) || '#000' : color1;
      color2 = color2_is_css_var ? styles.getPropertyValue(color2) || '#000' : color2;
    }
    let p1 = this.p1;
    let p2 = this.p2;
    if (Number.isNaN(p1)) p1 = null;
    if (Number.isNaN(Path2D)) p2 = null;

    this.__styleEle.innerHTML =
      `@property ${this.in}{syntax:'<color>';inherits:false;initial-value:#000;}` + `:scope{${this.var}:${CssColorMixElement.css_color_mix(this.in, color1, color2, p1, p2)}}`;
    super.updated(_changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'css-color-mix': CssColorMixElement;
  }
}
