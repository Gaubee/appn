import { i, r, _ as __esDecorate, a as __setFunctionName, t, b as __runInitializers, x } from './custom-element-T1yNbIOj.js';
import { c } from './consume-BRmWY3FS.js';
import { n } from './property-CF65yZga.js';
import { r as r$1, R as ResizeController } from './appn-scroll-view-4I2CV-xW.js';
import { e as eventProperty } from './event-property-dUqnKvcM.js';
import { b as appnNavigationHistoryEntryContext } from './appn-navigation-context-CU3HWNup.js';
import { a as appnThemeContext } from './appn-theme-context-D_VCnaSd.js';
import './create-context-CT4pxGTb.js';
import './lit-helper-BL1WAkuv.js';
import './signals-Bnipahbm.js';
import './decorators-D_q1KxA8.js';
import './func-Sj6vdvUs.js';
import './directive-DAJw2ZJj.js';
import './map-lhWNNA3b.js';
import './safe-property-BaHsMKyU.js';
import './iterable-BLBaa199.js';

const appnViewWithAppnPageStyle = i `::slotted(appn-view){padding-left:var(--safe-area-inset-left,0);padding-right:var(--safe-area-inset-right,0)}`;

for (const area of ['header', 'footer']) {
    CSS.registerProperty({
        name: `--page-${area}-height`,
        syntax: '<length-percentage>',
        inherits: true,
        initialValue: `0px`,
    });
}
const appnPageStyles = [
    i `:host{display:contents}.layer{margin:0;border:0;padding:0;width:fit-content;height:fit-content;overflow:hidden;color:var(--color-canvas-text);background-color:var(--color-canvas);box-sizing:border-box;box-shadow:0 0 2px -1px var(--color-canvas-text)}:host([mode=block]) .layer{position:relative}:host([mode=screen]) .layer{width:100%;height:100%}:host([mode=screen]) .layer::backdrop{background-color:var(--color-canvas-text);background-color:color-mix(in hsl,var(--color-canvas-text),transparent 80%)}.root{display:grid;grid-template-columns:1fr;grid-template-rows:min-content 1fr min-content;gap:0 0;width:100%;height:100%}.scrollable{overflow:auto;scroll-behavior:smooth;scrollbar-width:none;scrollbar-color:var(--color-canvas-text) transparent;scrollbar-color:color-mix(in hsl,var(--color-canvas-text),transparent 75.3%) transparent;position:absolute}.scrollable::after{content:' ';overflow:scroll;position:absolute;width:10px;height:100%;right:0;top:0}.header{width:100cqw;grid-area:1/1/2/2;z-index:3;position:sticky;top:0}.body{width:100cqw;grid-area:1/1/4/2;z-index:1;box-sizing:border-box;view-transition-name:body}.footer{width:100cqw;grid-area:3/1/4/2;z-index:2;position:sticky;bottom:0}::slotted(*){transform:translateZ(0)}`,
    appnViewWithAppnPageStyle,
];

/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
/**
 *
 */
let AppnPageElement = (() => {
    let _classDecorators = [t('appn-page')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _private_headerHeight_decorators;
    let _private_headerHeight_initializers = [];
    let _private_headerHeight_extraInitializers = [];
    let _private_headerHeight_descriptor;
    let _private_footerHeight_decorators;
    let _private_footerHeight_initializers = [];
    let _private_footerHeight_extraInitializers = [];
    let _private_footerHeight_descriptor;
    let _open_decorators;
    let _open_initializers = [];
    let _open_extraInitializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _theme_decorators;
    let _theme_initializers = [];
    let _theme_extraInitializers = [];
    let _pathname_decorators;
    let _pathname_initializers = [];
    let _pathname_extraInitializers = [];
    let _search_decorators;
    let _search_initializers = [];
    let _search_extraInitializers = [];
    let _hash_decorators;
    let _hash_initializers = [];
    let _hash_extraInitializers = [];
    let _navigationEntry_decorators;
    let _navigationEntry_initializers = [];
    let _navigationEntry_extraInitializers = [];
    let _onactivated_decorators;
    let _onactivated_initializers = [];
    let _onactivated_extraInitializers = [];
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _private_headerHeight_decorators = [r$1()];
            _private_footerHeight_decorators = [r$1()];
            _open_decorators = [n({ type: Boolean, reflect: true, attribute: true })];
            _mode_decorators = [n({ type: String, reflect: true, attribute: true })];
            _theme_decorators = [c({ context: appnThemeContext, subscribe: true })];
            _pathname_decorators = [n({ type: String, reflect: true, attribute: true })];
            _search_decorators = [n({ type: String, reflect: true, attribute: true })];
            _hash_decorators = [n({ type: String, reflect: true, attribute: true })];
            _navigationEntry_decorators = [c({ context: appnNavigationHistoryEntryContext, subscribe: true })];
            _onactivated_decorators = [eventProperty()];
            __esDecorate(this, _private_headerHeight_descriptor = { get: __setFunctionName(function () { return this.#headerHeight_accessor_storage; }, "#headerHeight", "get"), set: __setFunctionName(function (value) { this.#headerHeight_accessor_storage = value; }, "#headerHeight", "set") }, _private_headerHeight_decorators, { kind: "accessor", name: "#headerHeight", static: false, private: true, access: { has: obj => #headerHeight in obj, get: obj => obj.#headerHeight, set: (obj, value) => { obj.#headerHeight = value; } }, metadata: _metadata }, _private_headerHeight_initializers, _private_headerHeight_extraInitializers);
            __esDecorate(this, _private_footerHeight_descriptor = { get: __setFunctionName(function () { return this.#footerHeight_accessor_storage; }, "#footerHeight", "get"), set: __setFunctionName(function (value) { this.#footerHeight_accessor_storage = value; }, "#footerHeight", "set") }, _private_footerHeight_decorators, { kind: "accessor", name: "#footerHeight", static: false, private: true, access: { has: obj => #footerHeight in obj, get: obj => obj.#footerHeight, set: (obj, value) => { obj.#footerHeight = value; } }, metadata: _metadata }, _private_footerHeight_initializers, _private_footerHeight_extraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } }, metadata: _metadata }, _open_initializers, _open_extraInitializers);
            __esDecorate(this, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(this, null, _theme_decorators, { kind: "accessor", name: "theme", static: false, private: false, access: { has: obj => "theme" in obj, get: obj => obj.theme, set: (obj, value) => { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
            __esDecorate(this, null, _pathname_decorators, { kind: "accessor", name: "pathname", static: false, private: false, access: { has: obj => "pathname" in obj, get: obj => obj.pathname, set: (obj, value) => { obj.pathname = value; } }, metadata: _metadata }, _pathname_initializers, _pathname_extraInitializers);
            __esDecorate(this, null, _search_decorators, { kind: "accessor", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(this, null, _hash_decorators, { kind: "accessor", name: "hash", static: false, private: false, access: { has: obj => "hash" in obj, get: obj => obj.hash, set: (obj, value) => { obj.hash = value; } }, metadata: _metadata }, _hash_initializers, _hash_extraInitializers);
            __esDecorate(this, null, _navigationEntry_decorators, { kind: "accessor", name: "navigationEntry", static: false, private: false, access: { has: obj => "navigationEntry" in obj, get: obj => obj.navigationEntry, set: (obj, value) => { obj.navigationEntry = value; } }, metadata: _metadata }, _navigationEntry_initializers, _navigationEntry_extraInitializers);
            __esDecorate(this, null, _onactivated_decorators, { kind: "accessor", name: "onactivated", static: false, private: false, access: { has: obj => "onactivated" in obj, get: obj => obj.onactivated, set: (obj, value) => { obj.onactivated = value; } }, metadata: _metadata }, _onactivated_initializers, _onactivated_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static __all = Object.freeze([]);
        static get all() {
            return this.__all;
        }
        static styles = appnPageStyles;
        #headerHeight_accessor_storage = __runInitializers(this, _private_headerHeight_initializers, 0);
        get #headerHeight() { return _private_headerHeight_descriptor.get.call(this); }
        set #headerHeight(value) { return _private_headerHeight_descriptor.set.call(this, value); }
        __headerSize = (__runInitializers(this, _private_headerHeight_extraInitializers), new ResizeController(this, (entry) => {
            this.#headerHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        }, { box: 'border-box' }));
        #footerHeight_accessor_storage = __runInitializers(this, _private_footerHeight_initializers, 0);
        get #footerHeight() { return _private_footerHeight_descriptor.get.call(this); }
        set #footerHeight(value) { return _private_footerHeight_descriptor.set.call(this, value); }
        __footerSize = (__runInitializers(this, _private_footerHeight_extraInitializers), new ResizeController(this, (entry) => {
            this.#footerHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        }, { box: 'border-box' }));
        #open_accessor_storage = __runInitializers(this, _open_initializers, true);
        /**
         * The name to say "Hello" to.
         */
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #mode_accessor_storage = (__runInitializers(this, _open_extraInitializers), __runInitializers(this, _mode_initializers, 'screen'));
        get mode() { return this.#mode_accessor_storage; }
        set mode(value) { this.#mode_accessor_storage = value; }
        #theme_accessor_storage = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _theme_initializers, void 0));
        get theme() { return this.#theme_accessor_storage; }
        set theme(value) { this.#theme_accessor_storage = value; }
        #pathname_accessor_storage = (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _pathname_initializers, '*'));
        get pathname() { return this.#pathname_accessor_storage; }
        set pathname(value) { this.#pathname_accessor_storage = value; }
        #search_accessor_storage = (__runInitializers(this, _pathname_extraInitializers), __runInitializers(this, _search_initializers, '*'));
        get search() { return this.#search_accessor_storage; }
        set search(value) { this.#search_accessor_storage = value; }
        #hash_accessor_storage = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _hash_initializers, '*'));
        get hash() { return this.#hash_accessor_storage; }
        set hash(value) { this.#hash_accessor_storage = value; }
        #navigationEntry_accessor_storage = (__runInitializers(this, _hash_extraInitializers), __runInitializers(this, _navigationEntry_initializers, null));
        get navigationEntry() { return this.#navigationEntry_accessor_storage; }
        set navigationEntry(value) { this.#navigationEntry_accessor_storage = value; }
        #onactivated_accessor_storage = (__runInitializers(this, _navigationEntry_extraInitializers), __runInitializers(this, _onactivated_initializers, void 0));
        get onactivated() { return this.#onactivated_accessor_storage; }
        set onactivated(value) { this.#onactivated_accessor_storage = value; }
        __activatedNavigationEntry = __runInitializers(this, _onactivated_extraInitializers);
        updated(_changedProperties) {
            super.updated(_changedProperties);
            const { navigationEntry } = this;
            if (navigationEntry != this.__activatedNavigationEntry) {
                this.__activatedNavigationEntry = navigationEntry;
                if (navigationEntry) {
                    console.log('activated', navigationEntry);
                    this.dispatchEvent(new AppnPageActivatedEvent(navigationEntry));
                }
            }
        }
        render() {
            this.inert = !this.open;
            return x `
      <style>
        :host {
          --page-header-height: ${this.#headerHeight}px;
          --page-footer-height: ${this.#footerHeight}px;
        }
      </style>
      <div class="layer" part="layer">
        <appn-scroll-view class="root" part="root">
          <div class="header stuck-top" part="header" ${this.__headerSize.observe()}>
            <slot name="header"></slot>
          </div>
          <div class="body" part="body">
            <slot></slot>
          </div>
          <div class="footer stuck-bottom" part="footer" ${this.__footerSize.observe()}>
            <slot name="footer"></slot>
          </div>
        </appn-scroll-view>
      </div>
    `;
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();
class AppnPageActivatedEvent extends CustomEvent {
    constructor(entry) {
        super('activated', {
            detail: entry,
        });
    }
}

export { AppnPageActivatedEvent, AppnPageElement };
