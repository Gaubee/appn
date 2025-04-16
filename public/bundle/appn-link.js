import { E, i, r, _ as __esDecorate, a as __setFunctionName, t, b as __runInitializers, x } from './custom-element-T1yNbIOj.js';
import { c } from './consume-BRmWY3FS.js';
import { n } from './property-CF65yZga.js';
import { h, e as eventProperty } from './event-property-dUqnKvcM.js';
import { z } from './index-Ccu0cnQI.js';
import { s as safeProperty } from './safe-property-BaHsMKyU.js';
import { e as enumToSafeConverter } from './enum-to-safe-converter-BKItebm4.js';
import { a as appnNavigationContext, b as appnNavigationHistoryEntryContext } from './appn-navigation-context-CU3HWNup.js';
import './create-context-CT4pxGTb.js';
import './directive-DAJw2ZJj.js';
import './decorators-D_q1KxA8.js';
import './map-lhWNNA3b.js';

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o=o=>o??E;

CSS.registerProperty({
    name: '--_link-halo-angle',
    syntax: '<angle>',
    inherits: true,
    initialValue: '0deg',
});
const appnLinkStyle = i `:host{display:contents}.link{display:inline-flex;flex-direction:row;align-items:baseline;box-sizing:border-box;-webkit-tap-highlight-color:transparent}button{font:var(--font);color:var(--color-accent);background:0 0;border:none;padding:.45em .75em;border-radius:.75em;cursor:pointer;position:relative;box-shadow:0 1px 5px -3px var(--color-canvas-text);transition-property:all;transition-duration:.3s;transition-timing-function:ease-out;--_link-halo-angle:36deg}button::before{content:'';display:block;position:absolute;inset:0;border-radius:calc(.5em);padding:1px;background:linear-gradient(var(--_link-halo-angle),var(--color-accent),rgb(0 0 0 / 50%),#fff);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;pointer-events:none;box-sizing:border-box;opacity:.5;transition-property:--_link-halo-angle;transition-duration:.5s;transition-timing-function:ease-out}button:not(:disabled):hover{transition-duration:.1s;box-shadow:0 1px 4px -2px var(--color-canvas-text);--_link-halo-angle:180deg}button:not(:disabled):active{transition-duration:.1s;box-shadow:0 0 3px -1px var(--color-canvas-text);transform:translateY(1px);--_link-halo-angle:318deg}button:not(:disabled):focus-within:focus-visible{transition-duration:.1s;box-shadow:0 1px 4px -2px var(--color-canvas-text)}button:disabled{filter:grayscale(.5) contrast(.5);cursor:not-allowed}a{font:var(--font);color:var(--color-accent);text-decoration:none;cursor:pointer;transition-property:all;transition-duration:var(--common-leave-duration);transition-timing-function:var(--common-leave-ease)}.a{text-decoration:underline 1px transparent;text-underline-offset:0.3em}.a:hover,.a:target{transition-duration:.1s;text-decoration-color:currentColor;text-underline-offset:0.1em}.text-button:active{opacity:.5;transition-property:all;transition-duration:var(--common-enter-duration);transition-timing-function:var(--common-enter-ease)}`;

const APP_LINK_MODE_ENUM_VALUES = ['push', 'replace', 'forward', 'back', 'back-or-push', 'forward-or-push'];
const APP_LINK_TYPE_ENUM_VALUES = ['button', 'submit', 'a', 'text-button', 'contents'];
const APP_LINK_ACTION_TYPE_ENUM_VALUES = ['click', 'pointerup'];
/**
 * @attr {string} to - The URL to navigate to.
 * @attr {object} state - The state object to pass to the navigation.
 * @attr {AppnLinkType} type - The type of link. Defaults to 'a'.
 * @attr {AppLinkMode} mode - The mode of navigation. Defaults to 'push'.
 * @attr {AppnLinkActionType} actionType - The event-name of action to take when clicked. Defaults to 'click'.
 */
let AppnLinkElement = (() => {
    let _classDecorators = [t('appn-link')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _private_nav_decorators;
    let _private_nav_initializers = [];
    let _private_nav_extraInitializers = [];
    let _private_nav_descriptor;
    let _private_navigationEntry_decorators;
    let _private_navigationEntry_initializers = [];
    let _private_navigationEntry_extraInitializers = [];
    let _private_navigationEntry_descriptor;
    let _to_decorators;
    let _to_initializers = [];
    let _to_extraInitializers = [];
    let _toKey_decorators;
    let _toKey_initializers = [];
    let _toKey_extraInitializers = [];
    let _state_decorators;
    let _state_initializers = [];
    let _state_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _actionType_decorators;
    let _actionType_initializers = [];
    let _actionType_extraInitializers = [];
    let _onnavigate_decorators;
    let _onnavigate_initializers = [];
    let _onnavigate_extraInitializers = [];
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _type_decorators = [safeProperty(enumToSafeConverter(APP_LINK_TYPE_ENUM_VALUES))];
            _private_nav_decorators = [c({ context: appnNavigationContext })];
            _private_navigationEntry_decorators = [c({ context: appnNavigationHistoryEntryContext, subscribe: true })];
            _to_decorators = [n({ type: String, attribute: true, reflect: true })];
            _toKey_decorators = [n({ type: String, attribute: 'to-key', reflect: true })];
            _state_decorators = [n({ type: Object, attribute: true, reflect: true })];
            _mode_decorators = [safeProperty(enumToSafeConverter(APP_LINK_MODE_ENUM_VALUES))];
            _actionType_decorators = [safeProperty(enumToSafeConverter(APP_LINK_ACTION_TYPE_ENUM_VALUES))];
            _onnavigate_decorators = [eventProperty()];
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(this, _private_nav_descriptor = { get: __setFunctionName(function () { return this.#nav_accessor_storage; }, "#nav", "get"), set: __setFunctionName(function (value) { this.#nav_accessor_storage = value; }, "#nav", "set") }, _private_nav_decorators, { kind: "accessor", name: "#nav", static: false, private: true, access: { has: obj => #nav in obj, get: obj => obj.#nav, set: (obj, value) => { obj.#nav = value; } }, metadata: _metadata }, _private_nav_initializers, _private_nav_extraInitializers);
            __esDecorate(this, _private_navigationEntry_descriptor = { get: __setFunctionName(function () { return this.#navigationEntry_accessor_storage; }, "#navigationEntry", "get"), set: __setFunctionName(function (value) { this.#navigationEntry_accessor_storage = value; }, "#navigationEntry", "set") }, _private_navigationEntry_decorators, { kind: "accessor", name: "#navigationEntry", static: false, private: true, access: { has: obj => #navigationEntry in obj, get: obj => obj.#navigationEntry, set: (obj, value) => { obj.#navigationEntry = value; } }, metadata: _metadata }, _private_navigationEntry_initializers, _private_navigationEntry_extraInitializers);
            __esDecorate(this, null, _to_decorators, { kind: "accessor", name: "to", static: false, private: false, access: { has: obj => "to" in obj, get: obj => obj.to, set: (obj, value) => { obj.to = value; } }, metadata: _metadata }, _to_initializers, _to_extraInitializers);
            __esDecorate(this, null, _toKey_decorators, { kind: "accessor", name: "toKey", static: false, private: false, access: { has: obj => "toKey" in obj, get: obj => obj.toKey, set: (obj, value) => { obj.toKey = value; } }, metadata: _metadata }, _toKey_initializers, _toKey_extraInitializers);
            __esDecorate(this, null, _state_decorators, { kind: "accessor", name: "state", static: false, private: false, access: { has: obj => "state" in obj, get: obj => obj.state, set: (obj, value) => { obj.state = value; } }, metadata: _metadata }, _state_initializers, _state_extraInitializers);
            __esDecorate(this, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(this, null, _actionType_decorators, { kind: "accessor", name: "actionType", static: false, private: false, access: { has: obj => "actionType" in obj, get: obj => obj.actionType, set: (obj, value) => { obj.actionType = value; } }, metadata: _metadata }, _actionType_initializers, _actionType_extraInitializers);
            __esDecorate(this, null, _onnavigate_decorators, { kind: "accessor", name: "onnavigate", static: false, private: false, access: { has: obj => "onnavigate" in obj, get: obj => obj.onnavigate, set: (obj, value) => { obj.onnavigate = value; } }, metadata: _metadata }, _onnavigate_initializers, _onnavigate_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = appnLinkStyle;
        #type_accessor_storage = __runInitializers(this, _type_initializers, 'button');
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #nav_accessor_storage = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _private_nav_initializers, null));
        get #nav() { return _private_nav_descriptor.get.call(this); }
        set #nav(value) { return _private_nav_descriptor.set.call(this, value); }
        #navigationEntry_accessor_storage = (__runInitializers(this, _private_nav_extraInitializers), __runInitializers(this, _private_navigationEntry_initializers, null));
        get #navigationEntry() { return _private_navigationEntry_descriptor.get.call(this); }
        set #navigationEntry(value) { return _private_navigationEntry_descriptor.set.call(this, value); }
        #to_accessor_storage = (__runInitializers(this, _private_navigationEntry_extraInitializers), __runInitializers(this, _to_initializers, null));
        get to() { return this.#to_accessor_storage; }
        set to(value) { this.#to_accessor_storage = value; }
        #toKey_accessor_storage = (__runInitializers(this, _to_extraInitializers), __runInitializers(this, _toKey_initializers, null));
        get toKey() { return this.#toKey_accessor_storage; }
        set toKey(value) { this.#toKey_accessor_storage = value; }
        #state_accessor_storage = (__runInitializers(this, _toKey_extraInitializers), __runInitializers(this, _state_initializers, null));
        get state() { return this.#state_accessor_storage; }
        set state(value) { this.#state_accessor_storage = value; }
        #mode_accessor_storage = (__runInitializers(this, _state_extraInitializers), __runInitializers(this, _mode_initializers, 'push'));
        get mode() { return this.#mode_accessor_storage; }
        set mode(value) { this.#mode_accessor_storage = value; }
        #actionType_accessor_storage = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _actionType_initializers, 'click'));
        get actionType() { return this.#actionType_accessor_storage; }
        set actionType(value) { this.#actionType_accessor_storage = value; }
        #onnavigate_accessor_storage = (__runInitializers(this, _actionType_extraInitializers), __runInitializers(this, _onnavigate_initializers, void 0));
        get onnavigate() { return this.#onnavigate_accessor_storage; }
        set onnavigate(value) { this.#onnavigate_accessor_storage = value; }
        __onClick = (__runInitializers(this, _onnavigate_extraInitializers), async (event) => {
            event.preventDefault();
            const nav = this.#nav;
            const currentEntry = this.#navigationEntry;
            const { to, toKey, state } = this;
            if (nav == null) {
                return;
            }
            const to_url = to && new URL(to, nav.baseURI).href;
            const info = {
                to: to_url,
                mode: this.mode,
            };
            await z(this.mode)
                .with('push', () => {
                if (to_url) {
                    const event = new AppnLinkNavigateEvent({ type: 'push', url: to_url, state, info });
                    this.dispatchEvent(event);
                    event.applyNavigate(nav, currentEntry);
                }
            })
                .with('replace', () => {
                if (to_url) {
                    const event = new AppnLinkNavigateEvent({ type: 'replace', url: to_url, state, info });
                    this.dispatchEvent(event);
                    event.applyNavigate(nav, currentEntry);
                }
            })
                .with('forward', () => {
                if (to_url) {
                    nav.navigate(to_url, { state, info });
                }
                else if (nav.canGoForward) {
                    const event = new AppnLinkNavigateEvent({ type: 'forward', info });
                    this.dispatchEvent(event);
                    event.applyNavigate(nav, currentEntry);
                }
            })
                .with('back', async () => {
                if (to_url || toKey) {
                    const history = await nav.findFirstEntry(toKey ? { key: toKey } : { url: to_url });
                    if (history) {
                        const event = new AppnLinkNavigateEvent({ type: 'traverse', key: history.key, info });
                        this.dispatchEvent(event);
                        event.applyNavigate(nav, currentEntry);
                    }
                }
                else if (nav.canGoBack) {
                    const event = new AppnLinkNavigateEvent({ type: 'back', info });
                    this.dispatchEvent(event);
                    event.applyNavigate(nav, currentEntry);
                }
            })
                .with('back-or-push', async () => {
                if (to_url || toKey) {
                    const history = await nav.findLastEntry(toKey ? { key: toKey } : { url: to_url }, this.#navigationEntry);
                    if (history) {
                        const event = new AppnLinkNavigateEvent({ type: 'traverse', key: history.key, info });
                        this.dispatchEvent(event);
                        event.applyNavigate(nav, currentEntry);
                    }
                    else if (to_url) {
                        const event = new AppnLinkNavigateEvent({ type: 'push', url: to_url, state, info });
                        this.dispatchEvent(event);
                        event.applyNavigate(nav, currentEntry);
                    }
                }
            })
                .with('forward-or-push', async () => {
                if (to_url || toKey) {
                    const history = await nav.findFirstEntry(toKey ? { key: toKey } : { url: to_url }, this.#navigationEntry);
                    if (history) {
                        const event = new AppnLinkNavigateEvent({ type: 'traverse', key: history.key, info });
                        this.dispatchEvent(event);
                        event.applyNavigate(nav, currentEntry);
                    }
                    else if (to_url) {
                        const event = new AppnLinkNavigateEvent({ type: 'push', url: to_url, state, info });
                        this.dispatchEvent(event);
                        event.applyNavigate(nav, currentEntry);
                    }
                }
            })
                .exhaustive();
        });
        constructor() {
            super();
            this.addEventListener(this.actionType, this.__onClick);
        }
        willUpdate(_changedProperties) {
            const oldActionType = _changedProperties.get('actionType');
            if (oldActionType) {
                this.removeEventListener(oldActionType, this.__onClick);
                this.addEventListener(this.actionType, this.__onClick);
            }
            super.willUpdate(_changedProperties);
        }
        render() {
            return h(z(this.type)
                .with('button', 'submit', (type) => x `<button part="link button" class="link ${type}" role="link" type="${type}"><slot></slot></button>`)
                .with('a', 'text-button', (type) => x `<a part="link a" class="link ${type}" href="${o(this.to)}"><slot></slot></a>`)
                .with('contents', () => x `<slot></slot>`)
                .exhaustive());
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();
class AppnLinkNavigateEvent extends CustomEvent {
    constructor(detail) {
        super('navigate', {
            detail,
            cancelable: true,
            bubbles: true,
            composed: true,
        });
    }
    #result;
    get result() {
        return this.#result;
    }
    applyNavigate(nav, currentEntry) {
        if (this.defaultPrevented) {
            return;
        }
        const { detail } = this;
        const result = z(detail)
            .with({ type: 'push' }, (detail) => nav.navigate(detail.url, detail))
            .with({ type: 'replace' }, (detail) => nav.navigate(detail.url, { ...detail, history: 'replace' }))
            .with({ type: 'back' }, (detail) => nav.back(detail))
            .with({ type: 'traverse' }, (detail) => nav.traverseTo(detail.key, detail))
            .with({ type: 'forward' }, (detail) => nav.forward(detail))
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

export { AppnLinkElement, AppnLinkNavigateEvent };
