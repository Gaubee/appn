import {consume} from '@lit/context';
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {enumToSafeConverter, safeProperty} from '../../utils/safe-property-converter';
import {appnNavigationContext, type AppnNavigation} from '../appn-navigation-provider/appn-navigation-context';
import {appnLinkStyle} from './appn-link.css';
import {match} from 'ts-pattern';

@customElement('appn-link')
export class AppnLinkElement extends LitElement {
  static override styles = appnLinkStyle;
  @safeProperty(enumToSafeConverter(['button', 'a', 'submit', 'contents']))
  accessor type: 'button' | 'a' | 'submit' | 'contents' = 'button';

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
  constructor() {
    super();
    this.addEventListener('click', this.__onClick);
  }

  override render() {
    return cache(
      match(this.type)
        .with('button', 'submit', (type) => html`<button part="link button" type="${type}"><slot></slot></button>`)
        .with('a', () => html`<a part="link a" href="${this.to}"><slot></slot></a>`)
        .with('contents', () => html`<slot></slot>`)
        .exhaustive()
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-link': AppnLinkElement;
  }
}
