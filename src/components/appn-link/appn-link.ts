import {consume} from '@lit/context';
import {html, LitElement, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {cache} from 'lit/directives/cache.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {match} from 'ts-pattern';
import {eventProperty, type PropertyEventListener} from '../../utils/event-property';
import {safeProperty} from '../../utils/safe-property';
import {enumToSafeConverter} from '../../utils/safe-property/enum-to-safe-converter';
import {appnNavigationContext, appnNavigationHistoryEntryContext} from '../appn-navigation/appn-navigation-context';
import type {AppnNavigation} from '../appn-navigation/appn-navigation-types';
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
  accessor #nav: AppnNavigation | null = null;
  @consume({context: appnNavigationHistoryEntryContext, subscribe: true})
  accessor #navigationEntry: NavigationHistoryEntry | null = null;

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

  @eventProperty<AppnLinkElement, AppnNavigateEvent>()
  accessor onnavigate!: PropertyEventListener<AppnLinkElement, AppnNavigateEvent>;

  private __onClick = async (event: Event) => {
    event.preventDefault();

    const nav = this.#nav;
    const currentEntry = this.#navigationEntry;
    const {to, toKey, state} = this;
    if (nav == null) {
      return;
    }

    const to_url = to && new URL(to, nav.baseURI).href;

    const info = {
      to: to_url,
      mode: this.mode,
      by: 'link',
    };
    const isEquals = () => {
      const {currentEntry} = nav;
      if (currentEntry) {
        if (currentEntry.url === to_url && Object.is(currentEntry.getState(), state)) {
          return true;
        }
      }
      return false;
    };

    await match(this.mode)
      .with('push', () => {
        if (to_url && !isEquals()) {
          const event = new AppnNavigateEvent({type: 'push', url: to_url, state, info});
          this.dispatchEvent(event);
          event.applyNavigate(nav, currentEntry);
        }
      })
      .with('replace', () => {
        if (to_url && !isEquals()) {
          const event = new AppnNavigateEvent({type: 'replace', url: to_url, state, info});
          this.dispatchEvent(event);
          event.applyNavigate(nav, currentEntry);
        }
      })
      .with('forward', () => {
        if (to_url) {
          nav.navigate(to_url, {state, info});
        } else if (nav.canGoForward) {
          const event = new AppnNavigateEvent({type: 'forward', info});
          this.dispatchEvent(event);
          event.applyNavigate(nav, currentEntry);
        }
      })
      .with('back', async () => {
        if (to_url || toKey) {
          const history = await nav.findFirstEntry(toKey ? {key: toKey} : {url: to_url});
          if (history) {
            const event = new AppnNavigateEvent({type: 'traverse', key: history.key, info});
            this.dispatchEvent(event);
            event.applyNavigate(nav, currentEntry);
          }
        } else if (nav.canGoBack) {
          const event = new AppnNavigateEvent({type: 'back', info});
          this.dispatchEvent(event);
          event.applyNavigate(nav, currentEntry);
        }
      })
      .with('back-or-push', async () => {
        if (to_url || toKey) {
          const history = await nav.findLastEntry(toKey ? {key: toKey} : {url: to_url}, this.#navigationEntry);
          if (history) {
            const event = new AppnNavigateEvent({type: 'traverse', key: history.key, info});
            this.dispatchEvent(event);
            event.applyNavigate(nav, currentEntry);
          } else if (to_url) {
            const event = new AppnNavigateEvent({type: 'push', url: to_url, state, info});
            this.dispatchEvent(event);
            event.applyNavigate(nav, currentEntry);
          }
        }
      })
      .with('forward-or-push', async () => {
        if (to_url || toKey) {
          const history = await nav.findFirstEntry(toKey ? {key: toKey} : {url: to_url}, this.#navigationEntry);
          if (history) {
            const event = new AppnNavigateEvent({type: 'traverse', key: history.key, info});
            this.dispatchEvent(event);
            event.applyNavigate(nav, currentEntry);
          } else if (to_url) {
            const event = new AppnNavigateEvent({type: 'push', url: to_url, state, info});
            this.dispatchEvent(event);
            event.applyNavigate(nav, currentEntry);
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

export namespace AppnNavigateEvent {
  interface DetailBase<T> {
    type: T;
  }
  interface TraverseDetail extends DetailBase<'traverse'> {
    key: string;
    info?: unknown;
  }
  interface PushDetail extends DetailBase<'push'> {
    url: string;
    info?: unknown;
    state?: unknown;
  }
  interface ReplaceDetail extends DetailBase<'replace'> {
    url: string;
    info?: unknown;
    state?: unknown;
  }
  interface BackDetail extends DetailBase<'back'> {
    info?: unknown;
  }
  interface ForwardDetail extends DetailBase<'forward'> {
    info?: unknown;
  }
  export type Detail = TraverseDetail | PushDetail | ReplaceDetail | BackDetail | ForwardDetail;
}
export class AppnNavigateEvent extends CustomEvent<AppnNavigateEvent.Detail> {
  constructor(detail: AppnNavigateEvent.Detail, type = 'navigate') {
    super(type, {
      detail,
      cancelable: true,
      bubbles: true,
      composed: true,
    });
  }
  #result?: NavigationResult;
  get result() {
    return this.#result;
  }
  applyNavigate(nav: AppnNavigation, currentEntry: NavigationHistoryEntry | null | undefined) {
    if (this.defaultPrevented) {
      return;
    }
    const {detail} = this;
    const result = match(detail)
      .with({type: 'push'}, (detail) => nav.navigate(detail.url, detail))
      .with({type: 'replace'}, (detail) => nav.navigate(detail.url, {...detail, history: 'replace'}))
      .with({type: 'back'}, (detail) => nav.back(detail))
      .with({type: 'traverse'}, (detail) => nav.traverseTo(detail.key, detail))
      .with({type: 'forward'}, (detail) => nav.forward(detail))
      .exhaustive();
    if (navigator.vibrate) {
      result.committed.then((r) => {
        if (r.key !== currentEntry?.key) {
          navigator.vibrate([10]);
        }
      });
    }

    this.#result = result;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'appn-link': AppnLinkElement;
  }
}
