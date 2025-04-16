import { r, _ as __esDecorate, a as __setFunctionName, t, b as __runInitializers, i, x } from './custom-element-T1yNbIOj.js';
import { c } from './consume-BRmWY3FS.js';
import { t as translucentStyle, a as autoBooleanProperty } from './translucent.css-SX0Wsits.js';
import { a as appnThemeContext } from './appn-theme-context-D_VCnaSd.js';
import './create-context-CT4pxGTb.js';
import './safe-property-BaHsMKyU.js';
import './property-CF65yZga.js';
import './decorators-D_q1KxA8.js';
import './map-lhWNNA3b.js';
import './iterable-BLBaa199.js';

/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
/**
 * 一个用于放置在 appn-page[slot=header] 的元素。
 * 提供了安全区域的渲染限制
 * 提供了与滚动监听相关的一些能力
 *
 * @fires stucktop - 当元素的粘性滚动生效时触发
 * @slot - 渲染在头部的内容，通常用来放置 appn-top-bar 等工具栏、导航栏等组件
 */
let AppnHeaderElement = (() => {
    let _classDecorators = [t('appn-header')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _private_theme_decorators;
    let _private_theme_initializers = [];
    let _private_theme_extraInitializers = [];
    let _private_theme_descriptor;
    let _translucent_decorators;
    let _translucent_initializers = [];
    let _translucent_extraInitializers = [];
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _private_theme_decorators = [c({ context: appnThemeContext, subscribe: true })];
            _translucent_decorators = [autoBooleanProperty()];
            __esDecorate(this, _private_theme_descriptor = { get: __setFunctionName(function () { return this.#theme_accessor_storage; }, "#theme", "get"), set: __setFunctionName(function (value) { this.#theme_accessor_storage = value; }, "#theme", "set") }, _private_theme_decorators, { kind: "accessor", name: "#theme", static: false, private: true, access: { has: obj => #theme in obj, get: obj => obj.#theme, set: (obj, value) => { obj.#theme = value; } }, metadata: _metadata }, _private_theme_initializers, _private_theme_extraInitializers);
            __esDecorate(this, null, _translucent_decorators, { kind: "accessor", name: "translucent", static: false, private: false, access: { has: obj => "translucent" in obj, get: obj => obj.translucent, set: (obj, value) => { obj.translucent = value; } }, metadata: _metadata }, _translucent_initializers, _translucent_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        #theme_accessor_storage = __runInitializers(this, _private_theme_initializers, void 0);
        get #theme() { return _private_theme_descriptor.get.call(this); }
        set #theme(value) { return _private_theme_descriptor.set.call(this, value); }
        #translucent_accessor_storage = (__runInitializers(this, _private_theme_extraInitializers), __runInitializers(this, _translucent_initializers, 'auto'));
        get translucent() { return this.#translucent_accessor_storage; }
        set translucent(value) { this.#translucent_accessor_storage = value; }
        static styles = [
            i `:host{display:flex;flex-direction:column;padding-top:var(--safe-area-inset-top,0)}`,
            translucentStyle,
        ];
        render() {
            const translucent = (this.translucent == 'auto' && this.#theme?.class.includes('ios')) ?? false;
            this.dataset.translucent = translucent ? 'yes' : 'no';
            return x `<slot></slot>`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _translucent_extraInitializers);
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();

export { AppnHeaderElement };
