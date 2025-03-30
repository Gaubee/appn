import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {safeProperty, enumToSafeConverter} from '../../utils/safe-property-converter';
import {cache} from 'lit/directives/cache';
import {appnNavigationContext, type AppnNavigation} from '../appn-navigation-provider/appn-navigation-context';
import {consume} from '@lit/context';

@customElement('appn-link')
export class AppnLinkElement extends LitElement {
  @safeProperty(enumToSafeConverter(['button', 'a', 'submit']))
  accessor type: 'button' | 'a' | 'submit' = 'button';

  @consume({context: appnNavigationContext})
  accessor __nav!: AppnNavigation;

  @property({type: String, attribute: true, reflect: true})
  accessor to: string = '';

  private __onClick = (event: Event) => {
    event.preventDefault();
    if (this.to) {
      this.__nav.navigate(this.to);
    }
  };

  override render() {
    return cache(this.type === 'button' ? html`<button type="button" @click=${this.__onClick}><slot></slot></button>` : html`<a href=${this.to}><slot></slot></a>`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-link': AppnLinkElement;
  }
}
