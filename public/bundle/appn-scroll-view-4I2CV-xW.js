import { T, i as i$1, r as r$1, _ as __esDecorate, a as __setFunctionName, t as t$1, b as __runInitializers, x } from './custom-element-T1yNbIOj.js';
import { n } from './property-CF65yZga.js';
import { h, e as eventProperty } from './event-property-dUqnKvcM.js';
import { c as cssLiteral } from './lit-helper-BL1WAkuv.js';
import { S as Signal, e as effect_state } from './signals-Bnipahbm.js';
import { f as func_remember, a as func_lazy } from './func-Sj6vdvUs.js';
import { e, i, t } from './directive-DAJw2ZJj.js';
import { m as map_get_or_put } from './map-lhWNNA3b.js';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

/**
 * 在数组末尾追加元素
 *
 * @example
 * ```ts
 * const arr = [] as number[]
 *
 * arr_set_next(arr, 1)
 *
 * // arr == [1]
 * ```
 */
/**
 * 移除数据中的指定的第一个匹配项
 * @param arr
 * @param value
 * @returns index
 */
const arr_remove_first = (arr, value) => {
    const index = arr.indexOf(value);
    if (index !== -1) {
        arr.splice(index, 1);
    }
    return index;
};

class ResizeDirective extends i {
    constructor(partInfo) {
        super(partInfo);
        if (partInfo.type !== t.ELEMENT) {
            throw new Error('The `resizeDirective` directive must be used on property of Element or SVGElement.');
        }
    }
    update(partInfo, [resizeController]) {
        resizeController.bindElement(partInfo.element);
        return T;
    }
    render(_) {
        return '';
    }
}
const resizeDirective = e(ResizeDirective);
/**
 * Observer Element Resize Reactive Controller
 *
 * <i18n lang="zh-cn">
 * 监测元素尺寸变动的 响应式控制器
 * </i18n>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API}
 */
class ResizeController {
    __resizeObserver;
    __options;
    __host;
    __callback;
    constructor(host, callback, options) {
        this.__host = host;
        this.__host.addController(this); // register for lifecycle updates
        this.__callback = callback;
        this.__options = options;
        this.__resizeObserver = new ResizeObserver((entries) => {
            this.__callback(entries[0]);
        });
    }
    hostConnected() {
        if (this.__bindingElement) {
            this.bindElement(this.__bindingElement);
        }
    }
    hostDisconnected() {
        this.__resizeObserver.disconnect();
    }
    __bindingElement;
    /**
     * 当前绑定的元素
     */
    get bindingElement() {
        return this.__bindingElement;
    }
    /**
     * 解除绑定
     * @returns this，方便进行链式调用
     */
    bindElement(ele) {
        if (this.__bindingElement !== ele) {
            if (this.__bindingElement != null) {
                this.__resizeObserver.unobserve(this.__bindingElement);
            }
            this.__bindingElement = ele;
            this.__resizeObserver.observe(ele, this.__options);
        }
        return this;
    }
    /**
     * 解除元素绑定
     * @param ele 所要解绑的元素
     * @returns 当前 bindingElement == null
     */
    unbindElement(ele = this.__bindingElement) {
        if (this.__bindingElement === ele && this.__bindingElement) {
            if (this.__bindingElement != null) {
                this.__resizeObserver.unobserve(this.__bindingElement);
                this.__bindingElement = undefined;
            }
        }
        return this.__bindingElement == null;
    }
    /**
     * 响应式绑定
     * @returns 用于挂载在 htmlTemplate-attribute 中的指令
     */
    observe() {
        // Pass a reference to the controller so the directive can
        // notify the controller on size changes.
        return resizeDirective(this);
    }
}

/**
 * 使用一个CustomElement可以避免样式污染，从而获取浏览器最原始的滚动条样式。
 *
 * 因为并没有专门的 media-query 可以用来判断浏览器默认行为到底是不是 overlay-scrollbar。
 * 通常来说有的平台有精确光标的，会对scrollbar进行渲染显示，否则会进行隐藏。
 * 当我们不能因此就这样简单判定，因为开发者模式的模拟，会模拟移动端的 overlay-scrollbar，所以即便此时没有精确光标，它也会 overlay-scrollbar
 *
 * 所以，这里的 ScrollbarTrackerElement 的思路就是从浏览器样式来进行入手，因为 scrollbar-width 是会影响渲染的，从这里入手去监听它是否感染了渲染宽度，从而判断是否 overlay-scrollbar
 *
 * @hideconstructor
 */
class ScrollbarTrackerElement extends HTMLElement {
    isOverlayState;
    constructor(isOverlayState, options = {}) {
        super();
        this.isOverlayState = isOverlayState;
        this.attachShadow({ mode: 'open' });
        const html = String.raw;
        this.shadowRoot.innerHTML = html `<style>:host{position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll;pointer-events:none;visibility:hidden;scrollbar-width:${options.scrollbarWidth ?? 'auto'}}.scroll-view,:host{position:absolute;top:-9999px;overflow:scroll;pointer-events:none;visibility:hidden}:host{width:0;height:0}.scroll-view{width:100px;height:100px;scrollbar-width:auto}.scroll-view-thin{width:100px;height:100px;scrollbar-width:thin}</style><div class="scroll-view"></div><div class="scroll-view-thin"></div>`;
        this.__scrollViewEle = this.shadowRoot.querySelector('.scroll-view');
        this.__scrollViewThinEle = this.shadowRoot.querySelector('.scroll-view-thin');
    }
    scrollbarAutoWidth = new Signal.State(16);
    scrollbarThinWidth = new Signal.State(11);
    __scrollViewEle;
    __scrollViewThinEle;
    __resizeObserver;
    connectedCallback() {
        this.__resizeObserver = new ResizeObserver((es) => {
            for (const entry of es) {
                const scrollbarWidth = es[0].borderBoxSize[0].inlineSize - es[0].contentBoxSize[0].inlineSize;
                if (entry.target.className === 'scroll-view') {
                    this.scrollbarAutoWidth.set(scrollbarWidth);
                }
                else if (entry.target.className === 'scroll-view-thin') {
                    this.scrollbarThinWidth.set(scrollbarWidth);
                }
            }
            const isOverlay = this.scrollbarAutoWidth.get() === 0;
            this.isOverlayState.set(isOverlay);
        });
        this.__resizeObserver.observe(this.__scrollViewEle);
        this.__resizeObserver.observe(this.__scrollViewThinEle);
    }
    disconnectedCallback() {
        this.__resizeObserver?.disconnect();
        this.__resizeObserver = undefined;
    }
}
customElements.define('iappn-scrollbar-tracker', ScrollbarTrackerElement);
const scrollbarOverlayStateify = func_remember(() => {
    const state = new Signal.State(
    /// 简单根据当前的光标行为判断一下，但这种判断并不准确，比如说开发模式下，模拟移动端，打开元素选择器，pointer的行为会发生改变
    matchMedia('(hover: none) and (pointer: coarse)').matches);
    const outer = new ScrollbarTrackerElement(state);
    document.body.appendChild(outer);
    return state;
});

const binds_offs_wm = /*@__PURE__*/ new WeakMap();
const addOff = (ele, handler, off) => {
    const binds = map_get_or_put(binds_offs_wm, ele, () => new WeakMap());
    const offs = map_get_or_put(binds, handler, () => []);
    offs.push(off);
};
const getAndRemoveOff = (ele, handler, off) => {
    const binds = binds_offs_wm.get(ele);
    const offs = binds?.get(handler);
    if (null == offs) {
        return;
    }
    if (off === undefined) {
        [off] = offs.splice(0, 1);
        if (offs.length === 0) {
            binds?.delete(handler);
        }
    }
    else {
        arr_remove_first(offs, off);
    }
    return off;
};
const caniuseScrollEnd = typeof window == 'undefined' ? true : 'onscrollend' in window;
const removeScrollendEventListener = func_lazy(() => {
    if (caniuseScrollEnd) {
        return (ele, handler) => ele.removeEventListener('scrollend', handler);
    }
    return (ele, handler) => {
        const off = getAndRemoveOff(ele, handler);
        off?.();
    };
});
/**
 * 借鉴于 https://github.com/argyleink/scrollyfills/blob/main/src/scrollend.js
 */
const addScrollendEventListener = func_lazy(() => {
    if (caniuseScrollEnd) {
        return (ele, handler) => {
            ele.addEventListener('scrollend', handler);
            return () => ele.removeEventListener('scrollend', handler);
        };
    }
    // Map of scroll-observed elements.
    const observed = new WeakMap();
    const pointers = new Set();
    // Track if any pointer is active
    document.addEventListener('touchstart', (e) => {
        for (const touch of e.changedTouches)
            pointers.add(touch.identifier);
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        for (const touch of e.changedTouches)
            pointers.delete(touch.identifier);
    }, { passive: true });
    document.addEventListener('touchcancel', (e) => {
        for (const touch of e.changedTouches)
            pointers.delete(touch.identifier);
    }, { passive: true });
    document.addEventListener('pointerdown', (e) => {
        pointers.add(e.pointerId);
    }, { passive: true });
    document.addEventListener('pointerup', (e) => {
        pointers.delete(e.pointerId);
    }, { passive: true });
    document.addEventListener('pointercancel', (e) => {
        pointers.delete(e.pointerId);
    }, { passive: true });
    const createScrollOb = (ele) => {
        const scrollOb = {
            scrollport: ele,
            timeout: 0,
            scrollListener: (_evt) => {
                clearTimeout(scrollOb.timeout);
                scrollOb.timeout = setTimeout(() => {
                    if (pointers.size) {
                        // if pointer(s) are down, wait longer
                        setTimeout(scrollOb.scrollListener, 100);
                    }
                    else {
                        // dispatch
                        scrollOb.scrollport.dispatchEvent(new Event('scrollend'));
                        scrollOb.timeout = 0;
                    }
                }, 100);
            },
            listeners: 0, // Count of number of listeners.
            start() {
                if (scrollOb.listeners === 0) {
                    ele.addEventListener('scroll', scrollOb.scrollListener);
                }
                scrollOb.listeners++;
            },
            stop() {
                scrollOb.listeners--;
                if (scrollOb.listeners === 0) {
                    ele.removeEventListener('scroll', scrollOb.scrollListener);
                }
            },
        };
        return scrollOb;
    };
    return (ele, handler) => {
        ele.addEventListener('scrollend', handler);
        const scrollOb = map_get_or_put(observed, ele, createScrollOb);
        scrollOb.start();
        const off = () => {
            getAndRemoveOff(ele, handler, off);
            ele.removeEventListener('scrollend', handler);
            scrollOb.stop();
        };
        addOff(ele, handler, off);
        return off;
    };
});

class ScrollDirective extends i {
    constructor(partInfo) {
        super(partInfo);
        if (partInfo.type !== t.ELEMENT) {
            throw new Error('The `scrollDirective` directive must be used on property of Element or SVGElement.');
        }
    }
    update(partInfo, [scrollController]) {
        scrollController.bindElement(partInfo.element);
        return T;
    }
    render(_) {
        return '';
    }
}
const scrollDirective = e(ScrollDirective);
/**
 * Listen Element ScrollEvent/ScrollEndEvent Reactive Controller
 *
 * <i18n lang="zh-cn">
 * 监听元素 ScrollEvent/ScrollEndEvent 事件的 响应式控制器
 * </i18n>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event}
 */
class ScrollController {
    __scrollObserver;
    __host;
    __callback;
    __options;
    constructor(host, callback, options) {
        this.__host = host;
        this.__host.addController(this); // register for lifecycle updates
        this.__callback = callback;
        this.__options = options;
        this.__scrollObserver = new ScrollObserver(this.__callback);
    }
    hostConnected() {
        if (this.__bindingElement) {
            this.bindElement(this.__bindingElement);
        }
    }
    hostDisconnected() {
        this.__scrollObserver.disconnect();
    }
    __bindingElement;
    /**
     * 当前绑定的元素
     */
    get bindingElement() {
        return this.__bindingElement;
    }
    /**
     * 解除绑定
     * @returns this，方便进行链式调用
     */
    bindElement(ele) {
        if (this.__bindingElement !== ele) {
            if (this.__bindingElement != null) {
                this.__scrollObserver.unobserve(this.__bindingElement);
            }
            this.__bindingElement = ele;
            this.__scrollObserver.observe(ele, this.__options);
            this.__options?.init?.(ele);
        }
        return this;
    }
    /**
     * 解除元素绑定
     * @param ele 所要解绑的元素
     * @returns 当前 bindingElement == null
     */
    unbindElement(ele = this.__bindingElement) {
        if (this.__bindingElement === ele && this.__bindingElement) {
            if (this.__bindingElement != null) {
                this.__scrollObserver.unobserve(this.__bindingElement);
                this.__bindingElement = undefined;
            }
        }
        return this.__bindingElement == null;
    }
    /**
     * 响应式绑定
     * @returns 用于挂载在 htmlTemplate-attribute 中的指令
     */
    observe() {
        // Pass a reference to the controller so the directive can
        // notify the controller on size changes.
        return scrollDirective(this);
    }
}
class ScrollObserver {
    __callback;
    constructor(callback) {
        this.__callback = callback;
    }
    __onscroll = (event) => {
        this.__callback(event);
    };
    __onscrollend = (event) => {
        this.__callback(event);
    };
    __eles = new Map();
    observe(ele, opts = {}) {
        if (this.__eles.has(ele)) {
            return;
        }
        this.__eles.set(ele, opts);
        ele.addEventListener('scroll', this.__onscroll);
        addScrollendEventListener(ele, this.__onscrollend);
    }
    unobserve(ele) {
        if (!this.__eles.has(ele)) {
            return;
        }
        this.__eles.delete(ele);
        ele.removeEventListener('scroll', this.__onscroll);
        removeScrollendEventListener(ele, this.__onscrollend);
    }
    disconnect() {
        for (const ele of [...this.__eles.keys()]) {
            this.unobserve(ele);
        }
    }
}

const scrollbarProperties = [
    { name: '--scrollbar-blur-color', syntax: '<color>', initialValue: '#0001' },
    { name: '--scrollbar-color', syntax: '<color>', initialValue: '#0003' },
    { name: '--scrollbar-hover-color', syntax: '<color>', initialValue: '#0006' },
    { name: '--scrollbar-size', syntax: '<length>', initialValue: '6px' },
];
for (const pro of scrollbarProperties) {
    CSS.registerProperty({
        ...pro,
        inherits: true,
    });
}
const appnScrollViewStyle = i$1 `  @media (prefers-color-scheme: dark) {    :host {      --scrollbar-blur-color: #fff1;      --scrollbar-color: #fff3;      --scrollbar-hover-color: #fff6;    }  }  :host(:not(:hover):not(:focus-within)) {    --scrollbar-color: var(--scrollbar-blur-color);  }  :host {    display: block;    overflow: auto;    position: relative;    overflow: scroll;    scroll-behavior: smooth;    container-type: size;    container-type: size scroll-state;    container-name: scrollview;  }  .content {    width: max-content;    height: max-content;    z-index: 1;    position: relative;    transform: translateZ(0); // 渲染成独立的层  }  .scrollbar-sticky {    position: sticky;    z-index: 2;    width: 0;    height: 0;    top: 0;    left: 0;    /* 原生滚动条不会被影响 */    pointer-events: none;  }  .scrollbar-wrapper {    width: var(--view-width);    height: var(--view-height);    position: relative;  }  .scrollbar {    // 这里禁用平滑滚动    scroll-behavior: auto;    -ms-overflow-style: auto;    position: absolute;    pointer-events: all;  }  .axis-y {    overflow-x: clip;    overflow-y: auto;    right: 0;    top: 0;    width: var(--scrollbar-track-size);    height: calc(100% - var(--scrollbar-track-size)); /* 为 corner 预留位置 */  }  .axis-x {    overflow-x: auto;    overflow-y: clip;    left: 0;    bottom: 0;    height: var(--scrollbar-track-size);    width: calc(100% - var(--scrollbar-track-size)); /* 为 corner 预留位置 */  }`;

/**
 * A scroll-view element of the style 'overflow: overlay'.
 * lightweight components that maximize the use of native capabilities.
 *
 * Core features:
 * - Mobile: Zero-overhead native scrolling
 * - Desktop: Native scrollbars (limited styling)
 * - CSS Scrollbars specification compliant
 *
 * @fires scrollend - Provides polyfill for browsers without native scrollend support
 * @slot - Scrollable content container
 * @csspart scrollbar - Scrollbar track
 * @csspart axis-y - Vertical scrollbar track
 * @csspart axis-x - Horizontal scrollbar track
 * @csspart content - Content container
 *
 * <i18n lang="zh-cn">
 * 一个样式为 `overflow: overlay` 的滚动元素
 * 非常轻量的组件，最大化地使用了原生的能力.
 *
 * 核心特性：
 * - 移动端：无额外开销的原生滚动
 * - 桌面端：原生滚动条（样式定制受限）
 * - 符合 CSS 滚动条标准规范
 *
 * @fires scrollend - 为不支持原生scrollend事件的浏览器提供垫片
 * @slot - 滚动内容容器
 * @csspart scrollbar - 滚动条轨道
 * @csspart axis-y - 垂直滚动条轨道
 * @csspart axis-x - 水平滚动条轨道
 * @csspart content - 内容容器
 * </i18n>
 */
let AppnScrollViewElement = (() => {
    let _classDecorators = [t$1('appn-scroll-view')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r$1;
    let _scrollbarSize_decorators;
    let _scrollbarSize_initializers = [];
    let _scrollbarSize_extraInitializers = [];
    let _scrollbarColor_decorators;
    let _scrollbarColor_initializers = [];
    let _scrollbarColor_extraInitializers = [];
    let _onscrollend_decorators;
    let _onscrollend_initializers = [];
    let _onscrollend_extraInitializers = [];
    let _onscroll_decorators;
    let _onscroll_initializers = [];
    let _onscroll_extraInitializers = [];
    let _private_contentWidth_decorators;
    let _private_contentWidth_initializers = [];
    let _private_contentWidth_extraInitializers = [];
    let _private_contentWidth_descriptor;
    let _private_contentHeight_decorators;
    let _private_contentHeight_initializers = [];
    let _private_contentHeight_extraInitializers = [];
    let _private_contentHeight_descriptor;
    let _private_hostWidth_decorators;
    let _private_hostWidth_initializers = [];
    let _private_hostWidth_extraInitializers = [];
    let _private_hostWidth_descriptor;
    let _private_hostHeight_decorators;
    let _private_hostHeight_initializers = [];
    let _private_hostHeight_extraInitializers = [];
    let _private_hostHeight_descriptor;
    let _private_scrollbarOverlayState_decorators;
    let _private_scrollbarOverlayState_initializers = [];
    let _private_scrollbarOverlayState_extraInitializers = [];
    let _private_scrollbarOverlayState_descriptor;
    var AppnScrollViewElement = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _scrollbarSize_decorators = [n({
                    type: String,
                    reflect: true,
                    attribute: 'scrollbar-size',
                })];
            _scrollbarColor_decorators = [n({
                    type: String,
                })];
            _onscrollend_decorators = [eventProperty()];
            _onscroll_decorators = [eventProperty()];
            _private_contentWidth_decorators = [r()];
            _private_contentHeight_decorators = [r()];
            _private_hostWidth_decorators = [r()];
            _private_hostHeight_decorators = [r()];
            _private_scrollbarOverlayState_decorators = [effect_state()];
            __esDecorate(this, null, _scrollbarSize_decorators, { kind: "accessor", name: "scrollbarSize", static: false, private: false, access: { has: obj => "scrollbarSize" in obj, get: obj => obj.scrollbarSize, set: (obj, value) => { obj.scrollbarSize = value; } }, metadata: _metadata }, _scrollbarSize_initializers, _scrollbarSize_extraInitializers);
            __esDecorate(this, null, _scrollbarColor_decorators, { kind: "accessor", name: "scrollbarColor", static: false, private: false, access: { has: obj => "scrollbarColor" in obj, get: obj => obj.scrollbarColor, set: (obj, value) => { obj.scrollbarColor = value; } }, metadata: _metadata }, _scrollbarColor_initializers, _scrollbarColor_extraInitializers);
            __esDecorate(this, null, _onscrollend_decorators, { kind: "accessor", name: "onscrollend", static: false, private: false, access: { has: obj => "onscrollend" in obj, get: obj => obj.onscrollend, set: (obj, value) => { obj.onscrollend = value; } }, metadata: _metadata }, _onscrollend_initializers, _onscrollend_extraInitializers);
            __esDecorate(this, null, _onscroll_decorators, { kind: "accessor", name: "onscroll", static: false, private: false, access: { has: obj => "onscroll" in obj, get: obj => obj.onscroll, set: (obj, value) => { obj.onscroll = value; } }, metadata: _metadata }, _onscroll_initializers, _onscroll_extraInitializers);
            __esDecorate(this, _private_contentWidth_descriptor = { get: __setFunctionName(function () { return this.#contentWidth_accessor_storage; }, "#contentWidth", "get"), set: __setFunctionName(function (value) { this.#contentWidth_accessor_storage = value; }, "#contentWidth", "set") }, _private_contentWidth_decorators, { kind: "accessor", name: "#contentWidth", static: false, private: true, access: { has: obj => #contentWidth in obj, get: obj => obj.#contentWidth, set: (obj, value) => { obj.#contentWidth = value; } }, metadata: _metadata }, _private_contentWidth_initializers, _private_contentWidth_extraInitializers);
            __esDecorate(this, _private_contentHeight_descriptor = { get: __setFunctionName(function () { return this.#contentHeight_accessor_storage; }, "#contentHeight", "get"), set: __setFunctionName(function (value) { this.#contentHeight_accessor_storage = value; }, "#contentHeight", "set") }, _private_contentHeight_decorators, { kind: "accessor", name: "#contentHeight", static: false, private: true, access: { has: obj => #contentHeight in obj, get: obj => obj.#contentHeight, set: (obj, value) => { obj.#contentHeight = value; } }, metadata: _metadata }, _private_contentHeight_initializers, _private_contentHeight_extraInitializers);
            __esDecorate(this, _private_hostWidth_descriptor = { get: __setFunctionName(function () { return this.#hostWidth_accessor_storage; }, "#hostWidth", "get"), set: __setFunctionName(function (value) { this.#hostWidth_accessor_storage = value; }, "#hostWidth", "set") }, _private_hostWidth_decorators, { kind: "accessor", name: "#hostWidth", static: false, private: true, access: { has: obj => #hostWidth in obj, get: obj => obj.#hostWidth, set: (obj, value) => { obj.#hostWidth = value; } }, metadata: _metadata }, _private_hostWidth_initializers, _private_hostWidth_extraInitializers);
            __esDecorate(this, _private_hostHeight_descriptor = { get: __setFunctionName(function () { return this.#hostHeight_accessor_storage; }, "#hostHeight", "get"), set: __setFunctionName(function (value) { this.#hostHeight_accessor_storage = value; }, "#hostHeight", "set") }, _private_hostHeight_decorators, { kind: "accessor", name: "#hostHeight", static: false, private: true, access: { has: obj => #hostHeight in obj, get: obj => obj.#hostHeight, set: (obj, value) => { obj.#hostHeight = value; } }, metadata: _metadata }, _private_hostHeight_initializers, _private_hostHeight_extraInitializers);
            __esDecorate(this, _private_scrollbarOverlayState_descriptor = { get: __setFunctionName(function () { return this.#scrollbarOverlayState_accessor_storage; }, "#scrollbarOverlayState", "get"), set: __setFunctionName(function (value) { this.#scrollbarOverlayState_accessor_storage = value; }, "#scrollbarOverlayState", "set") }, _private_scrollbarOverlayState_decorators, { kind: "accessor", name: "#scrollbarOverlayState", static: false, private: true, access: { has: obj => #scrollbarOverlayState in obj, get: obj => obj.#scrollbarOverlayState, set: (obj, value) => { obj.#scrollbarOverlayState = value; } }, metadata: _metadata }, _private_scrollbarOverlayState_initializers, _private_scrollbarOverlayState_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AppnScrollViewElement = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = appnScrollViewStyle;
        #scrollbarSize_accessor_storage = __runInitializers(this, _scrollbarSize_initializers, 'auto');
        get scrollbarSize() { return this.#scrollbarSize_accessor_storage; }
        set scrollbarSize(value) { this.#scrollbarSize_accessor_storage = value; }
        #scrollbarColor_accessor_storage = (__runInitializers(this, _scrollbarSize_extraInitializers), __runInitializers(this, _scrollbarColor_initializers, ''));
        get scrollbarColor() { return this.#scrollbarColor_accessor_storage; }
        set scrollbarColor(value) { this.#scrollbarColor_accessor_storage = value; }
        #onscrollend_accessor_storage = (__runInitializers(this, _scrollbarColor_extraInitializers), __runInitializers(this, _onscrollend_initializers, void 0));
        get onscrollend() { return this.#onscrollend_accessor_storage; }
        set onscrollend(value) { this.#onscrollend_accessor_storage = value; }
        #onscroll_accessor_storage = (__runInitializers(this, _onscrollend_extraInitializers), __runInitializers(this, _onscroll_initializers, void 0));
        get onscroll() { return this.#onscroll_accessor_storage; }
        set onscroll(value) { this.#onscroll_accessor_storage = value; }
        #contentWidth_accessor_storage = (__runInitializers(this, _onscroll_extraInitializers), __runInitializers(this, _private_contentWidth_initializers, 0));
        get #contentWidth() { return _private_contentWidth_descriptor.get.call(this); }
        set #contentWidth(value) { return _private_contentWidth_descriptor.set.call(this, value); }
        #contentHeight_accessor_storage = (__runInitializers(this, _private_contentWidth_extraInitializers), __runInitializers(this, _private_contentHeight_initializers, 0));
        get #contentHeight() { return _private_contentHeight_descriptor.get.call(this); }
        set #contentHeight(value) { return _private_contentHeight_descriptor.set.call(this, value); }
        __contentSize = (__runInitializers(this, _private_contentHeight_extraInitializers), new ResizeController(this, (entry) => {
            const borderBox = entry.borderBoxSize[0];
            this.#contentWidth = borderBox.inlineSize;
            this.#contentHeight = borderBox.blockSize;
        }));
        #hostWidth_accessor_storage = __runInitializers(this, _private_hostWidth_initializers, 0);
        get #hostWidth() { return _private_hostWidth_descriptor.get.call(this); }
        set #hostWidth(value) { return _private_hostWidth_descriptor.set.call(this, value); }
        #hostHeight_accessor_storage = (__runInitializers(this, _private_hostWidth_extraInitializers), __runInitializers(this, _private_hostHeight_initializers, 0));
        get #hostHeight() { return _private_hostHeight_descriptor.get.call(this); }
        set #hostHeight(value) { return _private_hostHeight_descriptor.set.call(this, value); }
        __hostSize = (__runInitializers(this, _private_hostHeight_extraInitializers), new ResizeController(this, (entry) => {
            const borderBox = entry.borderBoxSize[0];
            this.#hostWidth = borderBox.inlineSize;
            this.#hostHeight = borderBox.blockSize;
        }));
        __currentScrollElement;
        /** 双向绑定所有权管理
         * 一旦某一个元素开始滚动，那么它将持有滚动所有权，知道scrollend触发，才会释放所有权
         */
        __canEffectScrollEvent(event) {
            const isCurrentTarget = this.__currentScrollElement == null || this.__currentScrollElement === event.target;
            if (event.type === 'scrollend') {
                this.__currentScrollElement = undefined;
            }
            else if (this.__currentScrollElement === undefined) {
                this.__currentScrollElement = event.target;
            }
            return isCurrentTarget;
        }
        __axisYScroll = new ScrollController(this, (event) => {
            if (this.__canEffectScrollEvent(event)) {
                // this.scrollTop = event.target.scrollTop;
                this.scrollTo({ top: event.target.scrollTop, behavior: 'instant' });
            }
        }, {
            init: (element) => {
                element.scrollTop = this.scrollTop;
            },
        });
        __axisXScroll = new ScrollController(this, (event) => {
            if (this.__canEffectScrollEvent(event)) {
                // this.scrollLeft = event.target.scrollLeft;
                this.scrollTo({ left: event.target.scrollLeft, behavior: 'instant' });
            }
        }, {
            init: (element) => {
                element.scrollLeft = this.scrollLeft;
            },
        });
        __hostScroll = new ScrollController(this, (event) => {
            if (this.__canEffectScrollEvent(event)) {
                const eleAxisX = this.__axisXScroll.bindingElement;
                const eleAxisY = this.__axisYScroll.bindingElement;
                if (eleAxisX && eleAxisY) {
                    const host = event.target;
                    eleAxisY.scrollTop = host.scrollTop;
                    eleAxisX.scrollLeft = host.scrollLeft;
                }
            }
        });
        __getScrollbarSizePx() {
            switch (this.scrollbarSize) {
                case 'auto':
                    return 10;
                case 'thin':
                    return 6;
                case 'none':
                    return 0;
                default:
                    return 10;
            }
        }
        /// 需要同时支持 scrollbar-width 与 scrollbar-color
        static __supportsCssScrollbar = CSS.supports('scrollbar-width: none') &&
            // 目前 Safari 不支持 scrollbar-color
            CSS.supports('scrollbar-color: currentColor transparent');
        #scrollbarOverlayState_accessor_storage = __runInitializers(this, _private_scrollbarOverlayState_initializers, scrollbarOverlayStateify());
        get #scrollbarOverlayState() { return _private_scrollbarOverlayState_descriptor.get.call(this); }
        set #scrollbarOverlayState(value) { return _private_scrollbarOverlayState_descriptor.set.call(this, value); }
        get canOverlayScrollbar() {
            return this.#scrollbarOverlayState.get();
        }
        render() {
            this.__hostSize.bindElement(this);
            const { canOverlayScrollbar } = this;
            const injectCss = [];
            if (canOverlayScrollbar) {
                this.__hostScroll.unbindElement(this);
            }
            else {
                // 进行滚动绑定
                this.__hostScroll.bindElement(this);
                /// 需要自己绘制 scrollbar
                const scrollbarSize = this.__getScrollbarSizePx();
                injectCss.push(i$1 `
        :host {
          --scrollbar-size: ${scrollbarSize}px;
        }
        .mock-content {
          width: calc(${this.#contentWidth}px - var(--scrollbar-track-size));
          height: calc(${this.#contentHeight}px - var(--scrollbar-track-size));
        }
      `);
                /**
                 * 首先隐藏最顶层的 scrollbar
                 * 然后渲染自定义的 scrollbar
                 */
                if (AppnScrollViewElement.__supportsCssScrollbar) {
                    const scrollbarTrackSize = scrollbarSize + 4;
                    injectCss.push(i$1 `
          :host {
            scrollbar-width: none;
            --scrollbar-track-size: ${scrollbarTrackSize}px;
          }
          .scrollbar {
            scrollbar-width: ${cssLiteral(this.scrollbarSize)};
            scrollbar-color: var(--scrollbar-color) transparent;
            transition-property: scrollbar-color;
            transition-duration: 250ms;
            transition-timing-function: ease-out;
          }
          .scrollbar:hover {
            scrollbar-color: var(--scrollbar-hover-color) transparent;
          }
        `);
                }
                else {
                    injectCss.push(i$1 `
          :host {
            --scrollbar-track-size: ${scrollbarSize}px;
          }
          :host::-webkit-scrollbar {
            width: 0px;
            height: 0px;
          }

          .scrollbar::-webkit-scrollbar {
            width: ${scrollbarSize}px;
            height: ${scrollbarSize}px;
          }
          .scrollbar::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-color);
            border-radius: ${scrollbarSize}px;
            border: 2px solid transparent;
            /**不支持动画 */
          }
          .scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-hover-color);
          }
          .scrollbar::-webkit-scrollbar-track {
            background-color: transparent;
          }
          .scrollbar::-webkit-scrollbar-corner {
            background-color: transparent;
          }
        `);
                }
            }
            return x `
      <style>
        ${injectCss}

        /* 盒子的宽高，用于子元素计算滚动内容 */
        :host {
          --view-width: ${this.#hostWidth}px;
          --view-height: ${this.#hostHeight}px;
        }
      </style>
      <div class="scrollbar-sticky">
        ${h(canOverlayScrollbar
                ? null
                : x `<div class="scrollbar-wrapper">
                <div part="scrollbar axis-y" class="scrollbar axis-y" role="scrollbar" ${this.__axisYScroll.observe()}>
                  <div class="mock-content" .inert=${true}></div>
                </div>
                <div part="scrollbar axis-x" class="scrollbar axis-x" role="scrollbar" ${this.__axisXScroll.observe()}>
                  <div class="mock-content" .inert=${true}></div>
                </div>
              </div>`)}
      </div>
      <div part="content" class="content" ${this.__contentSize.observe()}>
        <slot></slot>
      </div>
    `;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _private_scrollbarOverlayState_extraInitializers);
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return AppnScrollViewElement = _classThis;
})();

export { AppnScrollViewElement as A, ResizeController as R, r };
