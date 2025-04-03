import {consume} from '@lit/context';
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {enumToSafeConverter, safeProperty} from '../../utils/safe-property-converter';
import {appnNavigationContext, appnNavigationHistoryEntryContext, type AppnNavigation} from '../appn-navigation-provider/appn-navigation-context';
import {appnLinkStyle} from './appn-link.css';
import {match} from 'ts-pattern';
import {ifDefined} from 'lit/directives/if-defined.js';

const APP_LINK_MODE_ENUM_VALUES = ['push', 'replace', 'forward', 'back', 'back-or-push', 'forward-or-push'] as const;
export type AppLinkMode = (typeof APP_LINK_MODE_ENUM_VALUES)[number];
@customElement('appn-link')
export class AppnLinkElement extends LitElement {
  static override styles = appnLinkStyle;
  @safeProperty(enumToSafeConverter(['button', 'a', 'submit', 'contents']))
  accessor type: 'button' | 'a' | 'submit' | 'contents' = 'button';

  @consume({context: appnNavigationContext})
  accessor __nav!: AppnNavigation;
  @consume({context: appnNavigationHistoryEntryContext, subscribe: true})
  accessor __navigationEntry: NavigationHistoryEntry | null = null;

  @property({type: String, attribute: true, reflect: true})
  accessor to: string | null = null;
  @property({type: Object, attribute: true, reflect: true})
  accessor state: object | null = null;
  @safeProperty(enumToSafeConverter(APP_LINK_MODE_ENUM_VALUES))
  accessor mode: AppLinkMode = 'push';

  private __onClick = async (event: Event) => {
    event.preventDefault();

    const {to, __nav: nav, state} = this;
    const to_url = to && new URL(to, this.__nav.baseURI).href;

    const info = {
      to: to_url,
      mode: this.mode,
    };

    await match(this.mode)
      .with('push', () => {
        if (to_url != null) {
          nav.navigate(to_url, {state, info});
        }
      })
      .with('replace', () => {
        if (to_url != null) {
          nav.navigate(to_url, {history: 'replace', state, info});
        }
      })
      .with('forward', () => {
        if (to_url != null) {
          nav.navigate(to_url, {state, info});
        } else if (nav.canGoForward) {
          nav.forward({info});
        }
      })
      .with('back', async () => {
        if (to_url != null) {
          const history = await this.__nav.findFirstEntry({url: to_url});
          if (history) {
            nav.traverseTo(history.key, {info});
          }
        } else if (nav.canGoBack) {
          nav.back({info});
        }
      })
      .with('back-or-push', async () => {
        if (to_url != null) {
          const history = await this.__nav.findLastEntry({url: to_url}, this.__navigationEntry);
          if (history) {
            nav.traverseTo(history.key, {info});
          } else {
            nav.navigate(to_url, {state, info});
          }
        }
      })
      .with('forward-or-push', async () => {
        if (to_url != null) {
          const history = await this.__nav.findFirstEntry({url: to_url}, this.__navigationEntry);
          if (history) {
            nav.traverseTo(history.key, {info});
          } else {
            nav.navigate(to_url, {state, info});
          }
        }
      })
      .exhaustive();
  };
  constructor() {
    super();
    this.addEventListener('click', this.__onClick);
  }

  override render() {
    return cache(
      match(this.type)
        .with('button', 'submit', (type) => html`<button part="link button" role="link" type="${type}"><slot></slot></button>`)
        .with('a', () => html`<a part="link a" href="${ifDefined(this.to)}"><slot></slot></a>`)
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
