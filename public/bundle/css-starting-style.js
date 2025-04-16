import { a as __setFunctionName, r, _ as __esDecorate, t, i, b as __runInitializers, e as __classPrivateFieldGet } from './custom-element-T1yNbIOj.js';
import { n } from './property-CF65yZga.js';
import { z } from './index-Ccu0cnQI.js';
import { s as safeProperty } from './safe-property-BaHsMKyU.js';
import { e as enumToSafeConverter } from './enum-to-safe-converter-BKItebm4.js';
import { m as map_get_or_put, a as map_delete_and_get } from './map-lhWNNA3b.js';
import './decorators-D_q1KxA8.js';

const CSS_STARTING_STYLE_MODE_ENUM_VALUES = ['auto', 'native', 'shim'];
let CssStartingStyleElement = (() => {
    var _CssStartingStyleElement_tasks;
    let _classDecorators = [t('css-starting-style')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _mode_decorators;
    let _mode_initializers = [];
    let _mode_extraInitializers = [];
    let _selector_decorators;
    let _selector_initializers = [];
    let _selector_extraInitializers = [];
    let _slotted_decorators;
    let _slotted_initializers = [];
    let _slotted_extraInitializers = [];
    let _host_decorators;
    let _host_initializers = [];
    let _host_extraInitializers = [];
    let _layer_decorators;
    let _layer_initializers = [];
    let _layer_extraInitializers = [];
    let _cssText_decorators;
    let _cssText_initializers = [];
    let _cssText_extraInitializers = [];
    var CssStartingStyleElement = class extends _classSuper {
        static { _classThis = this; }
        static { __setFunctionName(this, "CssStartingStyleElement"); }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _mode_decorators = [safeProperty(enumToSafeConverter(CSS_STARTING_STYLE_MODE_ENUM_VALUES))];
            _selector_decorators = [n({ type: String, attribute: true, reflect: true })];
            _slotted_decorators = [n({ type: String, attribute: true, reflect: true })];
            _host_decorators = [n({ type: Boolean, attribute: true, reflect: true })];
            _layer_decorators = [n({ type: String, attribute: true, reflect: true })];
            _cssText_decorators = [n({ type: String, attribute: true, reflect: true })];
            __esDecorate(this, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } }, metadata: _metadata }, _mode_initializers, _mode_extraInitializers);
            __esDecorate(this, null, _selector_decorators, { kind: "accessor", name: "selector", static: false, private: false, access: { has: obj => "selector" in obj, get: obj => obj.selector, set: (obj, value) => { obj.selector = value; } }, metadata: _metadata }, _selector_initializers, _selector_extraInitializers);
            __esDecorate(this, null, _slotted_decorators, { kind: "accessor", name: "slotted", static: false, private: false, access: { has: obj => "slotted" in obj, get: obj => obj.slotted, set: (obj, value) => { obj.slotted = value; } }, metadata: _metadata }, _slotted_initializers, _slotted_extraInitializers);
            __esDecorate(this, null, _host_decorators, { kind: "accessor", name: "host", static: false, private: false, access: { has: obj => "host" in obj, get: obj => obj.host, set: (obj, value) => { obj.host = value; } }, metadata: _metadata }, _host_initializers, _host_extraInitializers);
            __esDecorate(this, null, _layer_decorators, { kind: "accessor", name: "layer", static: false, private: false, access: { has: obj => "layer" in obj, get: obj => obj.layer, set: (obj, value) => { obj.layer = value; } }, metadata: _metadata }, _layer_initializers, _layer_extraInitializers);
            __esDecorate(this, null, _cssText_decorators, { kind: "accessor", name: "cssText", static: false, private: false, access: { has: obj => "cssText" in obj, get: obj => obj.cssText, set: (obj, value) => { obj.cssText = value; } }, metadata: _metadata }, _cssText_initializers, _cssText_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CssStartingStyleElement = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static isSupports = typeof CSSStartingStyleRule === 'function';
        static shadowRootOptions = {
            ...r.shadowRootOptions,
            mode: 'closed',
        };
        //   static readonly css_starting_style = css_starting_style;
        //   static readonly css_starting_style_native = css_starting_style_native;
        //   static readonly css_starting_style_shim = css_starting_style_shim;
        static styles = i `:host{display:none}`;
        #mode_accessor_storage = __runInitializers(this, _mode_initializers, 'auto');
        get mode() { return this.#mode_accessor_storage; }
        set mode(value) { this.#mode_accessor_storage = value; }
        #selector_accessor_storage = (__runInitializers(this, _mode_extraInitializers), __runInitializers(this, _selector_initializers, ''));
        get selector() { return this.#selector_accessor_storage; }
        set selector(value) { this.#selector_accessor_storage = value; }
        #slotted_accessor_storage = (__runInitializers(this, _selector_extraInitializers), __runInitializers(this, _slotted_initializers, null));
        get slotted() { return this.#slotted_accessor_storage; }
        set slotted(value) { this.#slotted_accessor_storage = value; }
        #host_accessor_storage = (__runInitializers(this, _slotted_extraInitializers), __runInitializers(this, _host_initializers, false));
        get host() { return this.#host_accessor_storage; }
        set host(value) { this.#host_accessor_storage = value; }
        #layer_accessor_storage = (__runInitializers(this, _host_extraInitializers), __runInitializers(this, _layer_initializers, ''));
        get layer() { return this.#layer_accessor_storage; }
        set layer(value) { this.#layer_accessor_storage = value; }
        #cssText_accessor_storage = (__runInitializers(this, _layer_extraInitializers), __runInitializers(this, _cssText_initializers, ''));
        get cssText() { return this.#cssText_accessor_storage; }
        set cssText(value) { this.#cssText_accessor_storage = value; }
        __styleEle = (__runInitializers(this, _cssText_extraInitializers), document.createElement('style'));
        constructor() {
            super();
            this.append(this.__styleEle);
        }
        static {
            _CssStartingStyleElement_tasks = { value: new WeakMap() };
        }
        __watcher = new MutationObserver((mutations) => {
            let matchSelector = this.selector;
            let slotted = this.slotted;
            if (slotted != null) {
                if (slotted) {
                    matchSelector = `${matchSelector}:[name=${slotted}]`;
                }
                else {
                    matchSelector = `${matchSelector}:not([name])`;
                }
            }
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node instanceof Element) {
                        /**
                         * 这里不可以立即执行 matchs 进行判断
                         * 因为 lit 生命周期决定了 setProperty 不会立刻同步到 setAttribute 上，因此这里的 selector 可能不会正确匹配上
                         *
                         * 所以这里加入到微队列中，统一做匹配
                         */
                        const task = map_get_or_put(__classPrivateFieldGet(CssStartingStyleElement, _classThis, "f", _CssStartingStyleElement_tasks), node, (node) => {
                            const task = Object.assign(() => {
                                __classPrivateFieldGet(CssStartingStyleElement, _classThis, "f", _CssStartingStyleElement_tasks).delete(node);
                                for (const selector of task.matchs) {
                                    if (node.matches(selector)) {
                                        node.setAttribute('css-starting-style-hook', '');
                                        requestAnimationFrame(() => {
                                            node.removeAttribute('css-starting-style-hook');
                                        });
                                        break;
                                    }
                                }
                            }, { matchs: [] });
                            queueMicrotask(task);
                            return task;
                        });
                        task.matchs.push(matchSelector);
                    }
                }
                for (const node of m.removedNodes) {
                    if (node instanceof Element) {
                        if (map_delete_and_get(__classPrivateFieldGet(CssStartingStyleElement, _classThis, "f", _CssStartingStyleElement_tasks), node)) {
                            node.removeAttribute('css-starting-style-hook');
                        }
                    }
                }
            }
        });
        __watched = null;
        __effect_watch(watch) {
            if (watch) {
                if (this.__watched != watch) {
                    if (this.__watched) {
                        this.__watcher.disconnect();
                    }
                    this.__watched = watch;
                    this.__watcher.observe(watch, { childList: true, subtree: true });
                }
            }
            else {
                if (this.__watched) {
                    this.__watched = null;
                    this.__watcher.disconnect();
                }
            }
        }
        __root = null;
        connectedCallback() {
            const root = this.getRootNode();
            if ('querySelector' in root) {
                this.__root = root;
            }
            super.connectedCallback();
            /// 因为host选择器是在选择父级，而 MutationObserver 无法监听父级元素的插入
            /// 因此这里的垫片行为是基于 css-starting-style 自身的 connectedCallback/disconnectedCallback 的生命周期来替代 :host 元素的插入移除的监听
            /// 这是有局限性的，但不可避免
            if (this.host && root instanceof ShadowRoot) {
                queueMicrotask(() => {
                    if (this.dataset.mode === 'native') {
                        return;
                    }
                    const hostEle = root.host;
                    let matchSelector = this.selector;
                    if (hostEle.matches(matchSelector)) {
                        this.__hostEle = hostEle;
                        hostEle.setAttribute('css-starting-style-hook', '');
                        requestAnimationFrame(() => {
                            hostEle.removeAttribute('css-starting-style-hook');
                        });
                    }
                });
            }
        }
        __hostEle = null;
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.__hostEle) {
                this.__hostEle.removeAttribute('css-starting-style-hook');
                this.__hostEle = null;
            }
            this.__effect_watch(null);
            this.__root = null;
        }
        // protected override willUpdate(_changedProperties: PropertyValues): void {
        //     super.willUpdate(_changedProperties);
        // }
        render() {
            const { mode, cssText, layer, selector, slotted, host } = this;
            const useMode = mode === 'auto' ? (CssStartingStyleElement.isSupports ? 'native' : 'shim') : mode;
            this.dataset.mode = useMode;
            let ruleText = z(useMode)
                .with('native', () => {
                this.__effect_watch(null);
                let querySelector = selector;
                if (slotted != null) {
                    if (slotted) {
                        querySelector = `::slotted(${selector}:where([name=${slotted}]))`;
                    }
                    else {
                        querySelector = `::slotted(${selector}:not([name]))`;
                    }
                }
                else if (host) {
                    querySelector = `:host(${querySelector})`;
                }
                return `${querySelector}{@starting-style{${cssText}}}`;
            })
                .with('shim', () => {
                let watchEle = this.__root;
                // 如果选择器是 ::slotted() 开头，那么监听 hostElemnet
                if (slotted != null && watchEle instanceof ShadowRoot) {
                    watchEle = watchEle.host;
                }
                if (host) {
                    this.__effect_watch(null);
                }
                else {
                    this.__effect_watch(watchEle);
                }
                let querySelector = `${selector}:where([css-starting-style-hook])`;
                if (slotted != null) {
                    if (slotted) {
                        querySelector = `::slotted(${querySelector}:where([name=${slotted}])`;
                    }
                    else {
                        querySelector = `::slotted(${querySelector}:not([name]))`;
                    }
                }
                else if (host) {
                    querySelector = `:host(${querySelector})`;
                }
                return `${querySelector}{${cssText}}`;
            })
                .exhaustive();
            if (layer) {
                ruleText = `@layer ${layer}{${ruleText}}`;
            }
            this.__styleEle.innerHTML = ruleText;
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return CssStartingStyleElement = _classThis;
})();

export { CssStartingStyleElement };
