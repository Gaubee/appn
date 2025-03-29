import {LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import {enumProperty, valuesToEnumConverter} from '../../utils/enum-property-converter';

@customElement('appn-link')
export class AppnLinkElement extends LitElement {
  @enumProperty(valuesToEnumConverter(['button', 'a']))
  accessor type: 'button' | 'a' = 'button';
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-link': AppnLinkElement;
  }
}
