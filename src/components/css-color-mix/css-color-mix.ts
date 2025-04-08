import {obj_pick} from '@gaubee/util';
import type {Property} from 'csstype';
import {css, LitElement, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {match, P} from 'ts-pattern';
import {safeProperty} from '../../utils/safe-property';
import {rangeToSafeConverter} from '../../utils/safe-property/range-to-safe-converter';
import {calcMixColor, getCanvasCtx} from './css-color-mix.shim';

@customElement('css-color-mix')
export class CssColorMixElement extends LitElement {
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
  @safeProperty(rangeToSafeConverter(0, 100, {nullable: true}))
  accessor p1: number | null = null;
  @property({type: String, reflect: true, attribute: true})
  accessor c2: Property.Color = '#000';
  @safeProperty(rangeToSafeConverter(0, 100, {nullable: true}))
  accessor p2: number | null = null;

  private __styleEle = document.createElement('style');
  constructor() {
    super();
    this.appendChild(this.__styleEle);
  }
  private __getColorText = CSS.supports('color:color-mix(in srgb,#000,#000)')
    ? () => {
        return `color-mix(in ${this.in}, ${this.c1} ${this.p1 ?? ''}, ${this.c2} ${this.p2 ?? ''})`;
      }
    : () => {
        const {in: colorSpace, c1, c2} = this;
        const ctx = getCanvasCtx(colorSpace);
        const {p1, p2} = match(obj_pick(this, 'p1', 'p2'))
          .with({p1: P.nullish, p2: P.nullish}, () => ({p1: 50, p2: 50}))
          .exhaustive();
        return calcMixColor(ctx, c1, c2, p1, p2);
      };
  protected override updated(_changedProperties: PropertyValues): void {
    this.__styleEle.innerHTML = `:scope{${this.var}:${this.__getColorText()}}`;
    super.updated(_changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'css-color-mix': CssColorMixElement;
  }
}
