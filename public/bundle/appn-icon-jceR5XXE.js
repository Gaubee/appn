import { f, i as i$1, r as r$1, _ as __esDecorate, t, b as __runInitializers, d as b, x } from './custom-element-T1yNbIOj.js';
import { n as n$1 } from './property-CF65yZga.js';
import { e, i as i$2 } from './directive-DAJw2ZJj.js';
import { z } from './index-Ccu0cnQI.js';
import { s as styleToCss } from './css-helper-BmEjuA9v.js';
import { s as safeProperty } from './safe-property-BaHsMKyU.js';
import { e as enumToSafeConverter } from './enum-to-safe-converter-BKItebm4.js';
import { f as func_remember } from './func-Sj6vdvUs.js';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=Symbol();class h{get taskComplete(){return this.t||(1===this.i?this.t=new Promise(((t,s)=>{this.o=t,this.h=s;})):3===this.i?this.t=Promise.reject(this.l):this.t=Promise.resolve(this.u)),this.t}constructor(t,s,i){this.p=0,this.i=0,(this._=t).addController(this);const h="object"==typeof s?s:{task:s,args:i};this.v=h.task,this.j=h.args,this.m=h.argsEqual??r,this.k=h.onComplete,this.A=h.onError,this.autoRun=h.autoRun??true,"initialValue"in h&&(this.u=h.initialValue,this.i=2,this.O=this.T?.());}hostUpdate(){ true===this.autoRun&&this.S();}hostUpdated(){"afterUpdate"===this.autoRun&&this.S();}T(){if(void 0===this.j)return;const t=this.j();if(!Array.isArray(t))throw Error("The args function must return an array");return t}async S(){const t=this.T(),s=this.O;this.O=t,t===s||void 0===t||void 0!==s&&this.m(s,t)||await this.run(t);}async run(t){let s,h;t??=this.T(),this.O=t,1===this.i?this.q?.abort():(this.t=void 0,this.o=void 0,this.h=void 0),this.i=1,"afterUpdate"===this.autoRun?queueMicrotask((()=>this._.requestUpdate())):this._.requestUpdate();const r=++this.p;this.q=new AbortController;let e=false;try{s=await this.v(t,{signal:this.q.signal});}catch(t){e=true,h=t;}if(this.p===r){if(s===i)this.i=0;else {if(false===e){try{this.k?.(s);}catch{}this.i=2,this.o?.(s);}else {try{this.A?.(h);}catch{}this.i=3,this.h?.(h);}this.u=s,this.l=h;}this._.requestUpdate();}}abort(t){1===this.i&&this.q?.abort(t);}get value(){return this.u}get error(){return this.l}get status(){return this.i}render(t){switch(this.i){case 0:return t.initial?.();case 1:return t.pending?.();case 2:return t.complete?.(this.value);case 3:return t.error?.(this.error);default:throw Error("Unexpected status: "+this.i)}}}const r=(s,i)=>s===i||s.length===i.length&&s.every(((s,h)=>!f(s,i[h])));

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function n(n,r,t){return n?r(n):t?.(n)}

const icons = new Map();
const events = new EventTarget();
const appnIconDefine = (name, icon) => {
    if (icons.has(name)) {
        throw new Error(`icon ${name} already defined`);
    }
    icons.set(name, icon);
    events.dispatchEvent(new AppnIconDefineEvent(name, icon));
};
const appnIconGet = (name) => {
    return icons.get(name);
};
const appnIconWhenDefine = (name, hook) => {
    events.addEventListener('appn-icon-define-' + name, (event) => {
        hook(event.detail);
    }, { once: true });
};
class AppnIconDefineEvent extends CustomEvent {
    constructor(name, icon) {
        super('appn-icon-define-' + name, {
            detail: {
                name,
                icon,
            },
        });
    }
}
const appnIconSafeGet = async (name) => {
    let icon = appnIconGet(name);
    if (icon == null) {
        icon = await new Promise((resolve) => {
            appnIconWhenDefine(name, ({ icon }) => {
                resolve(icon);
            });
        });
    }
    return icon;
};

const appnIconStyle = [
    i$1 `:host{display:inline-flex;min-width:1em;min-height:1em;line-height:1;box-sizing:border-box;padding:.15em;align-self:center;object-fit:contain}svg{flex:1}`,
];

appnIconDefine('', {
    viewBox: { minX: 0, minY: 0, width: 0, height: 0 },
    layers: [],
});
appnIconDefine('chevron.backward', {
    viewBox: { minX: 0, minY: 0, width: 16.8523, height: 23.7394 },
    layers: [
        {
            type: 'path',
            d: 'M0 11.8672C0 12.209 0.123047 12.5098 0.382812 12.7695L11.2246 23.3652C11.457 23.6113 11.7578 23.7344 12.1133 23.7344C12.8242 23.7344 13.3711 23.2012 13.3711 22.4902C13.3711 22.1348 13.2207 21.834 13.002 21.6016L3.04883 11.8672L13.002 2.13281C13.2207 1.90039 13.3711 1.58594 13.3711 1.24414C13.3711 0.533203 12.8242 0 12.1133 0C11.7578 0 11.457 0.123047 11.2246 0.355469L0.382812 10.9648C0.123047 11.2109 0 11.5254 0 11.8672Z',
            fill: 'currentColor',
        },
    ],
    variants: [
        {
            selector: ':dir(rtl)',
            type: 'style',
            style: {
                transform: 'scaleX(-1)',
            },
        },
        {
            selector: '[data-font-weight="700"]',
            type: 'icon',
            viewBox: { minX: 0, minY: 0, width: 18.6604, height: 25.037 },
            layers: [
                {
                    type: 'path',
                    d: 'M0 12.5098C0 13.1852 0.244306 13.7429 0.804815 14.294L11.1403 24.4109C11.554 24.8327 12.0638 25.0276 12.6564 25.0276C13.8694 25.0276 14.8517 24.0561 14.8517 22.8563C14.8517 22.2491 14.6008 21.6994 14.1485 21.2471L5.14763 12.5018L14.1485 3.77248C14.6088 3.32019 14.8517 2.76245 14.8517 2.17129C14.8517 0.971451 13.8694 0 12.6564 0C12.0558 0 11.554 0.194887 11.1403 0.61664L0.804815 10.7256C0.2523 11.2767 0.0079938 11.8264 0 12.5098Z',
                    fill: 'currentColor',
                },
            ],
        },
    ],
});

const APPN_ICON_WIDGET_ENUM_VALUES = ['normal', 'bold', 100, 200, 300, 400, 500, 600, 700, 800, 900, 'bolder', 'lighter'];
/**
 * @attr {string} name - The name of the icon to display.
 * @attr {AppnIconWidget} widget - The widget of the icon to display.
 */
let AppnIconElement = (() => {
    let _classDecorators = [t('appn-icon')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r$1;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _widget_decorators;
    let _widget_initializers = [];
    let _widget_extraInitializers = [];
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _name_decorators = [n$1({ type: String, reflect: true, attribute: true })];
            _widget_decorators = [safeProperty(enumToSafeConverter(APPN_ICON_WIDGET_ENUM_VALUES))];
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(this, null, _widget_decorators, { kind: "accessor", name: "widget", static: false, private: false, access: { has: obj => "widget" in obj, get: obj => obj.widget, set: (obj, value) => { obj.widget = value; } }, metadata: _metadata }, _widget_initializers, _widget_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static define = appnIconDefine;
        static get = appnIconGet;
        static whenDefine = appnIconWhenDefine;
        static safeGet = appnIconSafeGet;
        static styles = appnIconStyle;
        #name_accessor_storage = __runInitializers(this, _name_initializers, null);
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #widget_accessor_storage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _widget_initializers, 'normal'));
        get widget() { return this.#widget_accessor_storage; }
        set widget(value) { this.#widget_accessor_storage = value; }
        __icon = (__runInitializers(this, _widget_extraInitializers), new h(this, {
            task: ([name]) => {
                return appnIconSafeGet(name ?? '');
            },
            args: () => [this.name],
        }));
        __effect_widget = func_remember((widget) => {
            const fontWeight = z(widget)
                .with('bolder', 'lighter', (value) => {
                const oldFontWeight = this.style.fontWeight;
                try {
                    this.style.fontWeight = value;
                    return +getComputedStyle(this).fontWeight;
                }
                finally {
                    this.style.fontWeight = oldFontWeight;
                }
            })
                .with('bold', () => 700)
                .with('normal', () => 400)
                .otherwise((v) => v);
            this.dataset.fontWeight = fontWeight.toString();
        }, (widget) => widget);
        __effect_icon_style = func_remember((icon) => {
            if (icon.variants) {
                const styleVariants = icon.variants.filter((v) => v.type === 'style'); //.map(v=>v.style);
                const cssText = styleVariants.map(({ selector, style }) => `:host(${selector}){${styleToCss(style)}}`).join('\n');
                return cssText;
            }
            return;
        }, (icon) => icon);
        render() {
            this.__effect_widget(this.widget);
            return this.__icon.render({
                complete: (icon) => {
                    const iconVariant = icon.variants?.find((variant) => variant.type === 'icon' && this.matches(variant.selector));
                    const { viewBox, layers } = iconVariant ?? icon;
                    const styleCssText = this.__effect_icon_style(icon);
                    return x `${n(styleCssText, () => x `<style>${styleCssText}</style>`)} <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}"><g>${layers.map((layer) => {
                        return z(layer)
                            .with({ type: 'path' }, (layer) => b `<path ${spread(layer)}>`)
                            .with({ type: 'polyline' }, (layer) => b `<polyline ${spread(layer)}>`)
                            .with({ type: 'rect' }, (layer) => b `<rect ${spread(layer)}>`)
                            .exhaustive();
                    })}</g></svg>`;
                },
            });
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();
class SpreadDirective extends i$2 {
    update(part, [props]) {
        const ele = part.element;
        for (const prop in props) {
            if (prop in ele) {
                ele[prop] = props[prop];
            }
            else {
                const attr = props[prop];
                if (attr != null) {
                    ele.setAttribute(prop, String(attr));
                }
            }
        }
        return this.render(props);
    }
    render(_props) {
        return '';
    }
}
const spread = e(SpreadDirective);

export { AppnIconElement as A, h, n, spread as s };
