import { r, _ as __esDecorate, t, i, x, b as __runInitializers } from './custom-element-T1yNbIOj.js';

/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
/**
 * 一个用于放置在 appn-page[slot=<default>] 的元素。
 * 提供了安全区域的渲染限制
 *
 * @fires stuckbottom - 当元素的粘性滚动生效时触发
 * @slot - 渲染在底部的内容，通常用来放置 appn-bottom-bar 等工具栏、导航栏等组件
 */
let AppnViewElement = (() => {
    let _classDecorators = [t('appn-view')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = i `:host{display:flex;flex-direction:column;align-items:flex-start;gap:var(--grid-unit)}`;
        render() {
            return x `<slot></slot>`;
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();

export { AppnViewElement };
