import {consume} from '@lit/context';
import {html, LitElement, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {match} from 'ts-pattern';
import {enumToSafeConverter, safeProperty} from '../../utils/safe-property-converter';
import {appnNavigationContext, appnNavigationHistoryEntryContext, type AppnNavigation} from '../appn-navigation-provider/appn-navigation-context';
import {appnLinkStyle} from './appn-link.css';

const APP_LINK_MODE_ENUM_VALUES = ['push', 'replace', 'forward', 'back', 'back-or-push', 'forward-or-push'] as const;
export type AppnLinkMode = (typeof APP_LINK_MODE_ENUM_VALUES)[number];

const APP_LINK_TYPE_ENUM_VALUES = ['button', 'submit', 'a', 'text-button', 'contents'] as const;
export type AppnLinkType = (typeof APP_LINK_TYPE_ENUM_VALUES)[number];

const APP_LINK_ACTION_TYPE_ENUM_VALUES = ['click', 'pointerup'] as const;
export type AppnLinkActionType = (typeof APP_LINK_ACTION_TYPE_ENUM_VALUES)[number];

/**
 * @attr {string} to - The URL to navigate to.
 * @attr {object} state - The state object to pass to the navigation.
 * @attr {AppnLinkType} type - The type of link. Defaults to 'a'.
 * @attr {AppLinkMode} mode - The mode of navigation. Defaults to 'push'.
 * @attr {AppnLinkActionType} actionType - The event-name of action to take when clicked. Defaults to 'click'.
 */
@customElement('appn-link')
export class AppnLinkElement extends LitElement {
  static override styles = appnLinkStyle;
  @safeProperty(enumToSafeConverter(APP_LINK_TYPE_ENUM_VALUES))
  accessor type: AppnLinkType = 'button';

  @consume({context: appnNavigationContext})
  private accessor __nav: AppnNavigation | null = null;
  @consume({context: appnNavigationHistoryEntryContext, subscribe: true})
  private accessor __navigationEntry: NavigationHistoryEntry | null = null;

  @property({type: String, attribute: true, reflect: true})
  accessor to: string | null = null;
  @property({type: String, attribute: 'to-key', reflect: true})
  accessor toKey: string | null = null;
  @property({type: Object, attribute: true, reflect: true})
  accessor state: object | null = null;
  @safeProperty(enumToSafeConverter(APP_LINK_MODE_ENUM_VALUES))
  accessor mode: AppnLinkMode = 'push';

  @safeProperty(enumToSafeConverter(APP_LINK_ACTION_TYPE_ENUM_VALUES))
  accessor actionType: AppnLinkActionType = 'click';
  private __onClick = async (event: Event) => {
    event.preventDefault();

    const {to, toKey, __nav: nav, state} = this;
    if (nav == null) {
      return;
    }

    const to_url = to && new URL(to, nav.baseURI).href;

    const info = {
      to: to_url,
      mode: this.mode,
    };

    await match(this.mode)
      .with('push', () => {
        if (to_url) {
          nav.navigate(to_url, {state, info});
        }
      })
      .with('replace', () => {
        if (to_url) {
          nav.navigate(to_url, {history: 'replace', state, info});
        }
      })
      .with('forward', () => {
        if (to_url) {
          nav.navigate(to_url, {state, info});
        } else if (nav.canGoForward) {
          nav.forward({info});
        }
      })
      .with('back', async () => {
        if (to_url || toKey) {
          const history = await nav.findFirstEntry(toKey ? {key: toKey} : {url: to_url});
          if (history) {
            nav.traverseTo(history.key, {info});
          }
        } else if (nav.canGoBack) {
          nav.back({info});
        }
      })
      .with('back-or-push', async () => {
        if (to_url || toKey) {
          const history = await nav.findLastEntry(toKey ? {key: toKey} : {url: to_url}, this.__navigationEntry);
          if (history) {
            nav.traverseTo(history.key, {info});
          } else if (to_url) {
            nav.navigate(to_url, {state, info});
          }
        }
      })
      .with('forward-or-push', async () => {
        if (to_url || toKey) {
          const history = await nav.findFirstEntry(toKey ? {key: toKey} : {url: to_url}, this.__navigationEntry);
          if (history) {
            nav.traverseTo(history.key, {info});
          } else if (to_url) {
            nav.navigate(to_url, {state, info});
          }
        }
      })
      .exhaustive();
  };
  constructor() {
    super();
    this.addEventListener(this.actionType, this.__onClick);
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    const oldActionType = _changedProperties.get('actionType');
    if (oldActionType) {
      this.removeEventListener(oldActionType, this.__onClick);
      this.addEventListener(this.actionType, this.__onClick);
    }
    super.willUpdate(_changedProperties);
  }

  override render() {
    return cache(
      match(this.type)
        .with('button', 'submit', (type) => html`<button part="link button" class="link ${type}" role="link" type="${type}"><slot></slot></button>`)
        .with('a', 'text-button', (type) => html`<a part="link a" class="link ${type}" href="${ifDefined(this.to)}"><slot></slot></a>`)
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
