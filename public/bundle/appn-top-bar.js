import { i, r, _ as __esDecorate, a as __setFunctionName, t, b as __runInitializers, x } from './custom-element-T1yNbIOj.js';
import { c } from './consume-BRmWY3FS.js';
import { h, n } from './appn-icon-jceR5XXE.js';
import { n as n$1 } from './property-CF65yZga.js';
import { e as e$1 } from './base-uB2zMOXV.js';
import './appn-link.js';
import { a as appnNavigationContext, b as appnNavigationHistoryEntryContext } from './appn-navigation-context-CU3HWNup.js';
import './css-starting-style.js';
import './create-context-CT4pxGTb.js';
import './directive-DAJw2ZJj.js';
import './index-Ccu0cnQI.js';
import './css-helper-BmEjuA9v.js';
import './func-Sj6vdvUs.js';
import './decorators-D_q1KxA8.js';
import './map-lhWNNA3b.js';
import './safe-property-BaHsMKyU.js';
import './enum-to-safe-converter-BKItebm4.js';
import './event-property-dUqnKvcM.js';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e(e,r){return (n,s,i)=>{const o=t=>t.renderRoot?.querySelector(e)??null;return e$1(n,s,{get(){return o(this)}})}}

/**
 * 向当前 state 中，写入一对 key-value 数组
 * 如果没有变更，不会触发写入
 */
const nav_before_history_entries = async (nav, currentId = nav?.currentEntry?.id) => {
    if (nav == null || currentId == null) {
        return;
    }
    const allEntries = await nav.entries();
    const currentIndex = allEntries.findIndex((entry) => entry.id === currentId);
    if (currentIndex > 0) {
        return allEntries.slice(0, currentIndex);
    }
    return;
};

CSS.registerProperty({
    name: '--title-clamp',
    syntax: '<integer>',
    inherits: false,
    initialValue: '1',
});
const appnTopBarStyle = i `:host{display:flex;flex-direction:row;align-items:baseline;padding-left:calc(var(--safe-area-inset-left,0px) * .5);padding-right:calc(var(--safe-area-inset-right,0px) * .5)}.leading{flex-shrink:0;min-width:48px;anchor-name:--leading;user-select:none}.back-button{view-transition-name:appn-top-bar-back-button}#nav-history{position-anchor:--leading;left:anchor(left);top:anchor(top);margin:0;backdrop-filter:blur(20px) contrast(0.5) brightness(max(var(--_light-brightness),var(--_dark-brightness)));width:max-content;max-height:calc(100cqh - var(--safe-area-inset-top) - var(--safe-area-inset-bottom));min-width:60cqw;padding:0;flex-direction:column;border-radius:var(--grid-unit);background:unset;border:unset;color:var(--color-canvas-text);box-shadow:0 0 calc(var(--grid-unit) * 4) 0 color-mix(in srgb,var(--color-canvas-text),transparent 80%);transition-property:all;transition-behavior:allow-discrete;transition-duration:var(--menu-leave-duration);transition-timing-function:var(--menu-leave-ease);transform-origin:top left}#nav-history li{list-style:none;transition-duration:var(--common-leave-duration);transition-timing-function:var(--common-leave-ease)}#nav-history li:hover{transition-duration:var(--common-enter-duration);transition-timing-function:var(--common-enter-ease);background-color:color-mix(in srgb,var(--color-canvas),transparent 50%)}#nav-history appn-link::part(link){padding:var(--grid-unit) calc(var(--grid-unit) * 1.5);width:100%}#nav-history hr{all:unset;height:var(--dpx);width:100%;background-color:var(--color-canvas-text);opacity:.2}#nav-history hr:last-child{display:none}#nav-history:popover-open{display:flex;transition-duration:var(--menu-enter-duration);transition-timing-function:var(--menu-enter-ease)}#nav-history:not(:popover-open){scale:0.5;opacity:0;box-shadow:0 0 0 0 transparent;pointer-events:none}.title{flex:1;overflow:hidden;text-overflow:ellipsis;text-align:center;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--title-clamp,1);height:2em;line-height:1.8;font-weight:600;view-transition-class:appn-top-bar-title}::view-transition-group(.appn-top-bar-title){transition-duration:var(--page-enter-duration);transition-timing-function:var(--page-enter-ease)}.actions{flex-shrink:0;min-width:48px}`;

/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
const navigation_entry_page_title_wm = new WeakMap();
const get_navigation_entry_page_title = (entry) => {
    return entry ? navigation_entry_page_title_wm.get(entry) : undefined;
};
const set_navigation_entry_page_title = (entry, page_title) => {
    if (entry) {
        navigation_entry_page_title_wm.set(entry, page_title);
    }
};
/**
 * 顶部工具栏组件，参考了 material3-top-app-bar 的标准。
 *
 * @see {@link https://m3.material.io/components/top-app-bar/guidelines}
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
let AppnTopBarElement = (() => {
    let _classDecorators = [t('appn-top-bar')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _pageTitle_decorators;
    let _pageTitle_initializers = [];
    let _pageTitle_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    let _private_nav_decorators;
    let _private_nav_initializers = [];
    let _private_nav_extraInitializers = [];
    let _private_nav_descriptor;
    let _private_navigationEntry_decorators;
    let _private_navigationEntry_initializers = [];
    let _private_navigationEntry_extraInitializers = [];
    let _private_navigationEntry_descriptor;
    let _private_navHistoryEle_decorators;
    let _private_navHistoryEle_initializers = [];
    let _private_navHistoryEle_extraInitializers = [];
    let _private_navHistoryEle_descriptor;
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _pageTitle_decorators = [n$1({ type: String, reflect: true, attribute: true })];
            _lines_decorators = [n$1({ type: Number, reflect: true, attribute: true })];
            _private_nav_decorators = [c({ context: appnNavigationContext })];
            _private_navigationEntry_decorators = [c({ context: appnNavigationHistoryEntryContext, subscribe: true })];
            _private_navHistoryEle_decorators = [e('#nav-history')];
            __esDecorate(this, null, _pageTitle_decorators, { kind: "accessor", name: "pageTitle", static: false, private: false, access: { has: obj => "pageTitle" in obj, get: obj => obj.pageTitle, set: (obj, value) => { obj.pageTitle = value; } }, metadata: _metadata }, _pageTitle_initializers, _pageTitle_extraInitializers);
            __esDecorate(this, null, _lines_decorators, { kind: "accessor", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            __esDecorate(this, _private_nav_descriptor = { get: __setFunctionName(function () { return this.#nav_accessor_storage; }, "#nav", "get"), set: __setFunctionName(function (value) { this.#nav_accessor_storage = value; }, "#nav", "set") }, _private_nav_decorators, { kind: "accessor", name: "#nav", static: false, private: true, access: { has: obj => #nav in obj, get: obj => obj.#nav, set: (obj, value) => { obj.#nav = value; } }, metadata: _metadata }, _private_nav_initializers, _private_nav_extraInitializers);
            __esDecorate(this, _private_navigationEntry_descriptor = { get: __setFunctionName(function () { return this.#navigationEntry_accessor_storage; }, "#navigationEntry", "get"), set: __setFunctionName(function (value) { this.#navigationEntry_accessor_storage = value; }, "#navigationEntry", "set") }, _private_navigationEntry_decorators, { kind: "accessor", name: "#navigationEntry", static: false, private: true, access: { has: obj => #navigationEntry in obj, get: obj => obj.#navigationEntry, set: (obj, value) => { obj.#navigationEntry = value; } }, metadata: _metadata }, _private_navigationEntry_initializers, _private_navigationEntry_extraInitializers);
            __esDecorate(this, _private_navHistoryEle_descriptor = { get: __setFunctionName(function () { return this.#navHistoryEle_accessor_storage; }, "#navHistoryEle", "get"), set: __setFunctionName(function (value) { this.#navHistoryEle_accessor_storage = value; }, "#navHistoryEle", "set") }, _private_navHistoryEle_decorators, { kind: "accessor", name: "#navHistoryEle", static: false, private: true, access: { has: obj => #navHistoryEle in obj, get: obj => obj.#navHistoryEle, set: (obj, value) => { obj.#navHistoryEle = value; } }, metadata: _metadata }, _private_navHistoryEle_initializers, _private_navHistoryEle_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = appnTopBarStyle;
        #pageTitle_accessor_storage = __runInitializers(this, _pageTitle_initializers, '');
        /**
         * The name to say "Hello" to.
         */
        get pageTitle() { return this.#pageTitle_accessor_storage; }
        set pageTitle(value) { this.#pageTitle_accessor_storage = value; }
        #lines_accessor_storage = (__runInitializers(this, _pageTitle_extraInitializers), __runInitializers(this, _lines_initializers, 1));
        /**
         * The number of times the button has been clicked.
         */
        get lines() { return this.#lines_accessor_storage; }
        set lines(value) { this.#lines_accessor_storage = value; }
        #nav_accessor_storage = (__runInitializers(this, _lines_extraInitializers), __runInitializers(this, _private_nav_initializers, null));
        get #nav() { return _private_nav_descriptor.get.call(this); }
        set #nav(value) { return _private_nav_descriptor.set.call(this, value); }
        #navigationEntry_accessor_storage = (__runInitializers(this, _private_nav_extraInitializers), __runInitializers(this, _private_navigationEntry_initializers, null));
        get #navigationEntry() { return _private_navigationEntry_descriptor.get.call(this); }
        set #navigationEntry(value) { return _private_navigationEntry_descriptor.set.call(this, value); }
        __preNavsTask = (__runInitializers(this, _private_navigationEntry_extraInitializers), new h(this, {
            task: ([nav, currentNavEntryId]) => {
                return nav_before_history_entries(nav, currentNavEntryId);
            },
            args: () => [this.#nav, this.#navigationEntry?.id],
        }));
        #navHistoryEle_accessor_storage = __runInitializers(this, _private_navHistoryEle_initializers, void 0);
        get #navHistoryEle() { return _private_navHistoryEle_descriptor.get.call(this); }
        set #navHistoryEle(value) { return _private_navHistoryEle_descriptor.set.call(this, value); }
        render() {
            set_navigation_entry_page_title(this.#navigationEntry, this.pageTitle);
            return x `<style>:host{--title-clamp:${this.lines}}</style><div class="leading"><slot name="start">${this.__preNavsTask.render({
                complete: (preNavEntries) => {
                    if (!preNavEntries || preNavEntries.length === 0) {
                        return;
                    }
                    const prePageTitle = get_navigation_entry_page_title(preNavEntries.at(-1));
                    return x `<appn-link class="back-button" mode="back" type="text-button" @contextmenu="${(e) => {
                        e.preventDefault();
                        this.#navHistoryEle?.showPopover();
                    }}"><appn-icon name="chevron.backward" widget="bold"></appn-icon>${prePageTitle}</appn-link>${n(preNavEntries.length > 0, () => x `<menu popover id="nav-history">${preNavEntries.reverse().map((entry) => x `<li><appn-link mode="back" to-key="${entry.key}" type="text-button" actionType="pointerup" @navigate="${() => this.#navHistoryEle?.hidePopover()}">${get_navigation_entry_page_title(entry)}</appn-link></li><hr>`)}</menu>`)}`;
                },
            })}</slot></div><div class="title"><slot></slot></div><div class="actions"><slot name="end"></slot></div><css-starting-style selector="#nav-history:popover-open" cssText="scale:0.5;opacity:0.5;box-shadow:0 0 0 0 transparent;"></css-starting-style>`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _private_navHistoryEle_extraInitializers);
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();

export { AppnTopBarElement };
