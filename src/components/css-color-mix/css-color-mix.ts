import type {Property} from 'csstype';
import {css, LitElement, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {safeProperty} from '../../utils/safe-property';
import {percentageToSafeConverter} from '../../utils/safe-property/range-to-safe-converter';
import {css_color_mix} from './css-color-mix.shim';

@customElement('css-color-mix')
export class CssColorMixElement extends LitElement {
  static override readonly shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    mode: 'closed' as const,
  };
  static readonly css_color_mix = css_color_mix;
  static override styles = css`
    :host {
      display: none;
    }
  `;
  @property({type: String, reflect: true, attribute: true})
  accessor var: string = '--color-mix';
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
    this.__styleEle.innerHTML = `:scope{${this.var}:${CssColorMixElement.css_color_mix(this.in, this.c1, this.c2, this.p1, this.p2)}}`;
    super.updated(_changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'css-color-mix': CssColorMixElement;
  }
}
