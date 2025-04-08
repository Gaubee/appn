import type {Property} from 'csstype';
import {LitElement} from 'lit';
import {property} from 'lit/decorators';
import {safeProperty} from '../../utils/safe-property';
import {rangeToSafeConverter} from '../../utils/safe-property/range-to-safe-converter';

export class CssColorMixElement extends LitElement {
  @property({type: String, reflect: true, attribute: true})
  accessor in: String = 'srgb';
  @property({type: String, reflect: true, attribute: true})
  accessor c1: Property.Color = '#000000';
  @safeProperty(rangeToSafeConverter(0, 100, {nullable: true}))
  accessor p1: number | null = null;
  @property({type: String, reflect: true, attribute: true})
  accessor c2: Property.Color = '#000000';
  @safeProperty(rangeToSafeConverter(0, 100, {nullable: true}))
  accessor p2: number | null = null;
}
