import { Z, B, E } from './custom-element-T1yNbIOj.js';
import { e as e$1, i } from './directive-DAJw2ZJj.js';
import { s as safeProperty } from './safe-property-BaHsMKyU.js';
import { a as accessor } from './decorators-D_q1KxA8.js';
import { m as map_get_or_put } from './map-lhWNNA3b.js';

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const {I:t}=Z,e=(o,t)=>void 0!==o?._$litType$,l=o=>null!=o?._$litType$?.h,s=()=>document.createComment(""),r=(o,i,n)=>{const e=o._$AA.parentNode,l=o._$AB;if(void 0===n){const i=e.insertBefore(s(),l),c=e.insertBefore(s(),l);n=new t(i,c,o,o.options);}else {const t=n._$AB.nextSibling,i=n._$AM,c=i!==o;if(c){let t;n._$AQ?.(o),n._$AM=o,void 0!==n._$AP&&(t=o._$AU)!==i._$AU&&n._$AP(t);}if(t!==l||c){let o=n._$AA;for(;o!==t;){const t=o.nextSibling;e.insertBefore(o,l),o=t;}}}return n},u={},m=(o,t=u)=>o._$AH=t,p=o=>o._$AH,h$1=o=>{o._$AR();};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const d=t=>l(t)?t._$litType$.h:t.strings,h=e$1(class extends i{constructor(t){super(t),this.et=new WeakMap;}render(t){return [t]}update(s,[e$1]){const u=e(this.it)?d(this.it):null,h=e(e$1)?d(e$1):null;if(null!==u&&(null===h||u!==h)){const e=p(s).pop();let o=this.et.get(u);if(void 0===o){const s=document.createDocumentFragment();o=B(E,s),o.setConnected(false),this.et.set(u,o);}m(o,[e]),r(o,void 0,e);}if(null!==h){if(null===u||u!==h){const t=this.et.get(h);if(void 0!==t){const i=p(t).pop();h$1(s),r(s,void 0,i),m(s,[i]);}}this.it=e$1;}else this.it=void 0;return this.render(e$1)}});

const listeners = /*@__PURE__*/ new WeakMap();
const eventProperty = (
/**
 * 自定义eventName，否则会使用属性的名称来获得eventName，比如 onhi => "hi"
 */
eventName, opts = {}) => {
    return accessor((target, context) => {
        /// 如果这个属性已经存在，那么跳过。因为有时候，该修饰器是用来做标准的垫片支持的。
        if (context.name in target && !opts.override) {
            return;
        }
        if (!eventName) {
            const prop = context.name;
            const propStringify = typeof prop === 'symbol' ? prop.description : prop;
            if (typeof propStringify !== 'string' || false === propStringify.startsWith('on')) {
                throw new Error(`eventName is required for property ${String(prop)}`);
            }
            eventName = propStringify.slice(2); // remove /^on/
        }
        const eventType = eventName;
        return safeProperty({
            setProperty(value) {
                // 获取实例的监听器映射
                const instanceMap = map_get_or_put(listeners, this, () => new Map());
                const oldListener = instanceMap.get(eventType);
                // 绑定监听器
                if (typeof value === 'function' ||
                    /**
                     * 浏览器的实现中，onxxxx 就是能绑定object，非常奇葩（可能是判断 typeof null === 'object'😂）
                     * 这里只能去做兼容
                     */
                    (typeof value === 'object' && value !== null)) {
                    // 替换监听器（因为更换合法对象并不会改变事件绑定的顺序，所以这里直接替换，而不是删除后重新绑定）
                    if (oldListener) {
                        oldListener.handleEvent = value;
                    }
                    else {
                        // 添加监听器
                        const listener = { handleEvent: value };
                        this.addEventListener(eventType, listener);
                        instanceMap.set(eventType, listener);
                    }
                }
                else {
                    // 清理旧监听器
                    if (oldListener) {
                        this.removeEventListener(eventType, oldListener);
                        instanceMap.delete(eventType);
                    }
                    value = null;
                }
                return value;
            },
            getProperty() {
                const instanceMap = listeners.get(this);
                const currentListener = instanceMap?.get(eventType);
                return (currentListener?.handleEvent ?? null);
            },
            fromAttribute(value) {
                if (value != null) {
                    const fun = Function('event', value);
                    this.addEventListener(eventType, fun);
                }
                return context.access.get(this); // no change
            },
            toAttribute: false,
        })(target, context);
    });
};

export { eventProperty as e, h };
