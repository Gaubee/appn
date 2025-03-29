import {LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('appn-navigation')
export class AppnNavigationElement extends LitElement {}

declare global {
  interface HTMLElementTagNameMap {
    'appn-navigation': AppnNavigationElement;
  }
}
