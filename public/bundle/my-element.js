import { r, _ as __esDecorate, t, i, b as __runInitializers, x } from './custom-element-T1yNbIOj.js';
import { n } from './property-CF65yZga.js';

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
let MyElement = (() => {
    let _classDecorators = [t('my-element')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _count_decorators;
    let _count_initializers = [];
    let _count_extraInitializers = [];
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _name_decorators = [n()];
            _count_decorators = [n({ type: Number })];
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _count_decorators, { kind: "accessor", name: "count", static: false, private: false, access: { has: obj => "count" in obj, get: obj => obj.count, set: (obj, value) => { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = i `:host{display:block;border:solid 1px gray;padding:16px;max-width:800px}`;
        #name_accessor_storage = __runInitializers(this, _name_initializers, 'World');
        /**
         * The name to say "Hello" to.
         */
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #count_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _count_initializers, 0));
        /**
         * The number of times the button has been clicked.
         */
        get count() { return this.#count_accessor_storage; }
        set count(value) { this.#count_accessor_storage = value; }
        render() {
            return x `<h1>${this.sayHello(this.name)}!</h1><button @click="${this._onClick}" part="button">Click Count: ${this.count}</button><slot></slot>`;
        }
        _onClick() {
            this.count++;
            this.dispatchEvent(new CustomEvent('count-changed'));
        }
        /**
         * Formats a greeting
         * @param name The name to say "Hello" to
         */
        sayHello(name) {
            return `Hello, ${name}`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _count_extraInitializers);
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();

export { MyElement };
