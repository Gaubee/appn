import { i, r, _ as __esDecorate, a as __setFunctionName, t, b as __runInitializers, x } from './custom-element-T1yNbIOj.js';
import { e } from './provide-BBrWF2C4.js';
import { n } from './property-CF65yZga.js';
import { o as obj_props, g as getAdoptedStyleSheets } from './css-helper-BmEjuA9v.js';
import { S as Signal, s as state_map, e as effect_state } from './signals-Bnipahbm.js';
import { m as map_get_or_put } from './map-lhWNNA3b.js';
import { f as func_remember } from './func-Sj6vdvUs.js';
import { b as appnThemeMixin, r as registerAppnTheme, f as findAppnTheme, g as getAllAppnThemes, a as appnThemeContext } from './appn-theme-context-D_VCnaSd.js';
import './create-context-CT4pxGTb.js';
import './decorators-D_q1KxA8.js';
import './iterable-BLBaa199.js';

const matchMediaStateMap = /*@__PURE__*/ new Map();
/*@__NO_SIDE_EFFECTS__*/
const matchMediaSignalify = (query) => map_get_or_put(matchMediaStateMap, query, () => {
    const mediaQueryList = matchMedia(query);
    const state = new Signal.State(mediaQueryList.matches);
    // 添加监听（现代浏览器）
    mediaQueryList.addEventListener('change', (e) => {
        state.set(e.matches);
    });
    return state;
});

const colorSchemeStateify = func_remember(() => {
    const isDarkState = matchMediaSignalify('(prefers-color-scheme: dark)');
    return state_map(isDarkState, (isDark) => (isDark ? 'dark' : 'light'));
});

const unstyledLightTheme = {
    name: 'unstyled-light',
    class: ['unstyled', 'light'],
    gridUnit: '4px',
    colors: {
        Canvas: '#ffffff',
        CanvasText: '#000000',
        /// 如果支持，就使用原生的 AccentColor
        ...(CSS.supports('color: AccentColor')
            ? {
                Accent: 'AccentColor',
                AccentText: 'AccentColorText',
            }
            : {
                Accent: '#2e75ff',
                AccentText: '#ffffff',
            }),
        Red: 'red',
        Orange: 'orange',
        Yellow: 'yellow',
        Green: 'green',
        Mint: 'darkturquoise',
        Teal: 'teal',
        Cyan: 'cyan',
        Blue: 'blue',
        Indigo: 'indigo',
        Purple: 'purple',
        Pink: 'pink',
        Brown: 'brown',
    },
    safeAreaInset: {
        top: `env(safe-area-inset-top)`,
        right: `env(safe-area-inset-right)`,
        bottom: `env(safe-area-inset-bottom)`,
        left: `env(safe-area-inset-left)`,
    },
    font: {
        style: 'initial',
        variantLigatures: 'initial',
        variantCaps: 'initial',
        variantNumeric: 'initial',
        variantEastAsian: 'initial',
        variantAlternates: 'initial',
        variantPosition: 'initial',
        variantEmoji: 'initial',
        weight: 'initial',
        stretch: 'initial',
        size: 'initial',
        family: 'initial',
        opticalSizing: 'initial',
        sizeAdjust: 'initial',
        kerning: 'initial',
        featureSettings: 'initial',
        variationSettings: 'initial',
        lineHeight: 'initial',
    },
    transition: {
        common: {
            enter: {
                ease: 'ease-out',
                duration: '0.28s',
            },
            leave: {
                ease: 'ease-in',
                duration: '0.2s',
            },
        },
        /**
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/utils/transition/md.transition.ts#L21-L29}
         */
        page: {
            enter: {
                ease: 'cubic-bezier(0.36,0.66,0.04,1)',
                duration: '0.28s',
            },
            leave: {
                ease: 'cubic-bezier(0.47,0,0.745,0.715)',
                duration: '0.2s',
            },
        },
        /**
         * use material-design
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/toast/animations/md.enter.ts#L35}
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/action-sheet/animations/md.enter.ts#L27}
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/menu/menu.tsx#L20-L23}
         */
        toast: { ease: 'cubic-bezier(.36,.66,.04,1)', duration: '0.4s' },
        actionSheet: { ease: 'cubic-bezier(.36,.66,.04,1)', duration: '0.4s' },
        menu: {
            enter: { ease: 'cubic-bezier(0.0,0.0,0.2,1)', duration: '0.28s' },
            leave: { ease: 'cubic-bezier(0.4, 0, 0.6, 1)', duration: '0.2s' },
        },
    },
};
const unstyledDarkTheme = appnThemeMixin(unstyledLightTheme, {
    name: 'unstyled-dark',
    class: ['unstyled', 'dark'],
    colors: {
        Canvas: '#000000',
        CanvasText: '#ffffff',
    },
});

//#region --font-*
// 定义字体相关的自定义属性及其描述符
const fontProperties = [
    // font-weight: 使用 <integer> 是正确的
    { name: '--font-weight', syntax: '<integer>', initialValue: '400' },
    // font-style: 接受关键字 normal, italic, oblique, oblique <angle>，但因为syntax-descriptor的限制，我们只能先使用 * 来替代
    { name: '--font-style', syntax: '*', initialValue: 'normal' },
    // 注意：虽然 'oblique <angle>' 也是有效的，但为了简单起见，如果只关心基本关键字，可以只写 'normal | italic | oblique'
    // font-variant-*: 这些属性接受关键字。使用 '*' 作为通用语法是最简单的方式，
    // 因为精确定义所有可能的组合比较复杂。如果你只需要特定的值，可以列出它们。
    { name: '--font-variant-ligatures', syntax: '*', initialValue: 'normal' },
    { name: '--font-variant-caps', syntax: '*', initialValue: 'normal' },
    { name: '--font-variant-numeric', syntax: '*', initialValue: 'normal' },
    { name: '--font-variant-east-asian', syntax: '*', initialValue: 'normal' },
    { name: '--font-variant-alternates', syntax: '*', initialValue: 'normal' },
    { name: '--font-variant-position', syntax: 'normal | sub | super', initialValue: 'normal' }, // 这个比较简单，可以列出
    { name: '--font-variant-emoji', syntax: 'normal | text | emoji | unicode', initialValue: 'normal' }, // 这个也比较简单
    // font-stretch: 接受关键字或 <percentage>
    {
        name: '--font-stretch',
        syntax: '<percentage> | ultra-condensed | extra-condensed | condensed | semi-condensed | normal | semi-expanded | expanded | extra-expanded | ultra-expanded',
        initialValue: 'normal',
    },
    // font-size: 接受 <length>, <percentage>, 或绝对/相对关键字
    { name: '--font-size', syntax: '<length> | <percentage> | large | medium | small | x-large | x-small | xx-large | xx-small | smaller | larger', initialValue: 'medium' },
    // font-family: 语法非常复杂（字符串列表或关键字），使用 '*' 是最实用的
    { name: '--font-family', syntax: '*', initialValue: 'sans-serif' },
    // font-optical-sizing: 原始定义是正确的
    { name: '--font-optical-sizing', syntax: 'auto | none', initialValue: 'auto' },
    // font-size-adjust: 原始定义是正确的
    { name: '--font-size-adjust', syntax: '<number> | none', initialValue: 'none' },
    // font-kerning: 接受关键字
    { name: '--font-kerning', syntax: 'auto | normal | none', initialValue: 'auto' },
    // font-feature-settings: 语法复杂（normal 或特性标签列表），使用 '*'
    { name: '--font-feature-settings', syntax: '*', initialValue: 'normal' },
    // font-variation-settings: 语法复杂（normal 或变量设置列表），使用 '*'
    { name: '--font-variation-settings', syntax: '*', initialValue: 'normal' },
    // line-height: 接受 normal, <number>, <length>, <percentage>
    // 需要在 syntax 中加入 'normal' 关键字，因为它是 initialValue
    { name: '--line-height', syntax: 'normal | <number> | <length> | <percentage>', initialValue: 'normal' },
];
for (const prop of fontProperties) {
    CSS.registerProperty({
        ...prop,
        inherits: true,
    });
}
//#endregion
//#region --color-scheme-*
['dark', 'light'].forEach((colorScheme, initialValue) => {
    CSS.registerProperty({
        name: `--color-scheme-${colorScheme}`,
        syntax: '<number>', // 使用 number 而不是 integer，目的是有需要的话，可以进行动画。
        inherits: true,
        // light=1 dark=0
        initialValue: `${initialValue}`,
    });
});
//#endregion
//#region --color-*
for (const key of obj_props(unstyledLightTheme.colors)) {
    CSS.registerProperty({
        name: `--color-${key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-/, '')}`,
        syntax: '<color>',
        inherits: true,
        initialValue: unstyledLightTheme.colors[key],
    });
}
//#endregion
//#region --safe-area-inset-*
for (const pos of obj_props(unstyledLightTheme.safeAreaInset)) {
    CSS.registerProperty({
        name: `--safe-area-inset-${pos}`,
        syntax: '<length-percentage>',
        inherits: true,
        initialValue: '0px',
    });
}
//#endregion
//#region --grid-unit
CSS.registerProperty({
    name: '--grid-unit',
    syntax: '<length>',
    inherits: true,
    initialValue: unstyledLightTheme.gridUnit,
});
CSS.registerProperty({
    name: '--dpx',
    syntax: '<length>',
    inherits: true,
    initialValue: `${1 / window.devicePixelRatio}px`,
});
//#endregion
const appnThemeStyles = [
    i `:host{display:contents}::slotted(*){font-style:var(--font-style);font-variant-ligatures:var(--font-variant-ligatures);font-variant-caps:var(--font-variant-caps);font-variant-numeric:var(--font-variant-numeric);font-variant-east-asian:var(--font-variant-east-asian);font-variant-alternates:var(--font-variant-alternates);font-variant-position:var(--font-variant-position);font-variant-emoji:var(--font-variant-emoji);font-weight:var(--font-weight);font-stretch:var(--font-stretch);font-size:var(--font-size);font-family:var(--font-family);font-optical-sizing:var(--font-optical-sizing);font-size-adjust:var(--font-size-adjust);font-kerning:var(--font-kerning);font-feature-settings:var(--font-feature-settings);font-variation-settings:var(--font-variation-settings);line-height:var(--line-height);--font:var(--font-style) var(--font-variant-ligatures) var(--font-variant-caps) var(--font-variant-numeric) var(--font-variant-east-asian) var(--font-weight) var(--font-stretch) var(--font-size)/var(--line-height) var(--font-family);accent-color:var(--color-accent)}:host([data-color-scheme=light]){--color-scheme-light:1;--color-scheme-dark:0}:host([data-color-scheme=dark]){--color-scheme-light:0;--color-scheme-dark:1}`,
];

const iosBaseTheme = {
    gridUnit: '8px',
    safeAreaInset: {
        /// 左右默认提供1个网格的大小
        bottom: `max(env(safe-area-inset-left, var(--grid-unit)), var(--grid-unit))`,
        left: `max(env(safe-area-inset-left, var(--grid-unit)), var(--grid-unit))`,
    },
    font: {
        family: [
            /// 英文字体优先链
            '-apple-system' /* 系统自动调用 San Francisco (iOS/macOS) */,
            'BlinkMacSystemFont' /* Chrome 的 San Francisco 回退方案 */,
            "'Helvetica Neue'" /* iOS 7-8 及旧版 macOS 回退 */,
            "'Segoe UI'" /* Windows 系统适配 */,
            /// 中文字体优先链
            "'PingFang SC'" /* 苹方简体 (iOS 9+) */,
            "'HarmonyOS Sans SC'" /* 华为鸿蒙字体 */,
            "'HONOR Sans SC'" /* 荣耀字体 */,
            'MiSans' /* 小米字体 */,
            "'Source Han Sans SC'" /* 思源黑体 */,
            "'Hiragino Sans GB'" /* 冬青黑体 (旧版 macOS 中文回退) */,
            "'Microsoft YaHei'" /* 微软雅黑 (Windows 中文适配) */,
            'sans-serif' /* 通用无衬线兜底 */,
        ].join(', '),
    },
    transition: {
        common: {
            enter: {
                ease: 'ease-out',
                duration: '0.3s',
            },
            leave: {
                ease: 'ease-in',
                duration: '0.3s',
            },
        },
        /**
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/utils/transition/ios.transition.ts#L498C21-L498C48}
         */
        page: {
            enter: {
                ease: 'cubic-bezier(0.32,0.72,0,1)',
                duration: '0.54s',
            },
            leave: {
                ease: 'cubic-bezier(0.32,0.72,0,1)',
                duration: '0.54s',
            },
        },
        /**
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/toast/animations/ios.enter.ts#L35}
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/action-sheet/animations/ios.enter.ts#L27}
         * @see {@link https://github.com/ionic-team/ionic-framework/blob/4317da080ca26a27575a7f7905d2703c89b685cc/core/src/components/menu/menu.tsx#L20-L23}
         */
        toast: {
            enter: { ease: 'cubic-bezier(.155,1.105,.295,1.12)', duration: '0.4s' },
            leave: { ease: 'cubic-bezier(.36,.66,.04,1)', duration: '0.3s' },
        },
        actionSheet: {
            enter: { ease: 'cubic-bezier(.36,.66,.04,1)', duration: '0.4s' },
            leave: { ease: 'cubic-bezier(.36,.66,.04,1)', duration: '0.45s' },
        },
        menu: {
            enter: { ease: 'cubic-bezier(0.32,0.72,0,1)', duration: '0.3s' },
            leave: { ease: 'cubic-bezier(1, 0, 0.68, 0.28)', duration: '0.45s' },
        },
    },
};
/**
 * @see {@link https://developer.apple.com/design/human-interface-guidelines/color/#iOS-iPadOS-system-colors}
 */
const iosNamedColor = {
    Red: ['#ff3b30', '#ff453a', '#d70015', '#ff6961'],
    Orange: ['#ff9500', '#ff9f0a', '#c93400', '#ffb340'],
    Yellow: ['#ffcc00', '#ffd60a', '#b25000', '#ffd426'],
    Green: ['#34c759', '#30d158', '#248a3d', '#30db5b'],
    Mint: ['#00c7be', '#66d4cf', '#0c817b', '#66d4cf'],
    Teal: ['#30b0c7', '#40c8e0', '#008299', '#5de6ff'],
    Cyan: ['#32ade6', '#64d2ff', '#0071a4', '#70d7ff'],
    Blue: ['#007aff', '#0a84ff', '#0040dd', '#409cff'],
    Indigo: ['#5856d6', '#5e5ce6', '#3634a3', '#7d7aff'],
    Purple: ['#af52de', '#bf5af2', '#8944ab', '#da8fff'],
    Pink: ['#ff2d55', '#ff375f', '#d30f45', '#ff6482'],
    Brown: ['#a5845e', '#ac8e68', '#7f6545', '#b59469'],
};
const pickNamedColor = (at) => {
    const res = {};
    for (const key of obj_props(iosNamedColor)) {
        res[key] = iosNamedColor[key][at];
    }
    return res;
};
const iosLightTheme = appnThemeMixin(unstyledLightTheme, iosBaseTheme, {
    name: 'ios-light',
    class: ['ios', 'light'],
    colors: {
        CanvasText: '#1d1d1f',
        ...pickNamedColor(0),
    },
});
const iosDarkTheme = appnThemeMixin(unstyledDarkTheme, iosBaseTheme, {
    name: 'ios-dark',
    class: ['ios', 'dark'],
    colors: {
        Canvas: '#1c1c1e',
        ...pickNamedColor(1),
    },
});
const iosAccessibleLightTheme = appnThemeMixin(iosLightTheme, {
    name: 'ios-light-accessible',
    class: ['ios', 'light', 'accessible'],
    colors: {
        ...pickNamedColor(2),
    },
});
const iosAccessibleDarkTheme = appnThemeMixin(iosDarkTheme, {
    name: 'ios-dark-accessible',
    class: ['ios', 'dark', 'accessible'],
    colors: {
        ...pickNamedColor(3),
    },
});

/**
 * @license
 * Copyright 2025 Gaubee
 * SPDX-License-Identifier: MIT
 */
/// 将内置的主题注册到内存表
registerAppnTheme(
// unstyled
unstyledLightTheme, unstyledDarkTheme, 
// ios
iosLightTheme, iosDarkTheme, iosAccessibleLightTheme, iosAccessibleDarkTheme
// other...
);
/**
 * 一个用于提供主题的插槽
 * 开发者通过可以在此基础上进行一些定制
 */
let AppnThemeProviderElement = (() => {
    let _classDecorators = [t('appn-theme-provider')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _theme_decorators;
    let _theme_initializers = [];
    let _theme_extraInitializers = [];
    let _colorScheme_decorators;
    let _colorScheme_initializers = [];
    let _colorScheme_extraInitializers = [];
    let _private_colorSchemeState_decorators;
    let _private_colorSchemeState_initializers = [];
    let _private_colorSchemeState_extraInitializers = [];
    let _private_colorSchemeState_descriptor;
    let _accessible_decorators;
    let _accessible_initializers = [];
    let _accessible_extraInitializers = [];
    let _private_themeContext_decorators;
    let _private_themeContext_initializers = [];
    let _private_themeContext_extraInitializers = [];
    let _private_themeContext_descriptor;
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _theme_decorators = [n({ type: String, reflect: true, attribute: true })];
            _colorScheme_decorators = [n({ type: String, reflect: true, attribute: 'color-scheme' })];
            _private_colorSchemeState_decorators = [effect_state()];
            _accessible_decorators = [n({ type: Boolean, reflect: true, attribute: true })];
            _private_themeContext_decorators = [e({ context: appnThemeContext })];
            __esDecorate(this, null, _theme_decorators, { kind: "accessor", name: "theme", static: false, private: false, access: { has: obj => "theme" in obj, get: obj => obj.theme, set: (obj, value) => { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
            __esDecorate(this, null, _colorScheme_decorators, { kind: "accessor", name: "colorScheme", static: false, private: false, access: { has: obj => "colorScheme" in obj, get: obj => obj.colorScheme, set: (obj, value) => { obj.colorScheme = value; } }, metadata: _metadata }, _colorScheme_initializers, _colorScheme_extraInitializers);
            __esDecorate(this, _private_colorSchemeState_descriptor = { get: __setFunctionName(function () { return this.#colorSchemeState_accessor_storage; }, "#colorSchemeState", "get"), set: __setFunctionName(function (value) { this.#colorSchemeState_accessor_storage = value; }, "#colorSchemeState", "set") }, _private_colorSchemeState_decorators, { kind: "accessor", name: "#colorSchemeState", static: false, private: true, access: { has: obj => #colorSchemeState in obj, get: obj => obj.#colorSchemeState, set: (obj, value) => { obj.#colorSchemeState = value; } }, metadata: _metadata }, _private_colorSchemeState_initializers, _private_colorSchemeState_extraInitializers);
            __esDecorate(this, null, _accessible_decorators, { kind: "accessor", name: "accessible", static: false, private: false, access: { has: obj => "accessible" in obj, get: obj => obj.accessible, set: (obj, value) => { obj.accessible = value; } }, metadata: _metadata }, _accessible_initializers, _accessible_extraInitializers);
            __esDecorate(this, _private_themeContext_descriptor = { get: __setFunctionName(function () { return this.#themeContext_accessor_storage; }, "#themeContext", "get"), set: __setFunctionName(function (value) { this.#themeContext_accessor_storage = value; }, "#themeContext", "set") }, _private_themeContext_decorators, { kind: "accessor", name: "#themeContext", static: false, private: true, access: { has: obj => #themeContext in obj, get: obj => obj.#themeContext, set: (obj, value) => { obj.#themeContext = value; } }, metadata: _metadata }, _private_themeContext_initializers, _private_themeContext_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static registerTheme = registerAppnTheme;
        static findTheme = findAppnTheme;
        static get allThemes() {
            return getAllAppnThemes();
        }
        static styles = appnThemeStyles;
        #theme_accessor_storage = __runInitializers(this, _theme_initializers, 'unstyled');
        /**
         * 在通过 registerTheme 接口注册theme后，可以使用 theme 属性来查询对应的 theme
         * 可以同时书写多项：theme="ios dark"
         */
        get theme() { return this.#theme_accessor_storage; }
        set theme(value) { this.#theme_accessor_storage = value; }
        #colorScheme_accessor_storage = (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _colorScheme_initializers, 'auto'));
        /**
         * 颜色偏好
         * 会在查询 theme 的时候，自动添加 dark/light 查询条件
         */
        get colorScheme() { return this.#colorScheme_accessor_storage; }
        set colorScheme(value) { this.#colorScheme_accessor_storage = value; }
        #colorSchemeState_accessor_storage = (__runInitializers(this, _colorScheme_extraInitializers), __runInitializers(this, _private_colorSchemeState_initializers, colorSchemeStateify()));
        get #colorSchemeState() { return _private_colorSchemeState_descriptor.get.call(this); }
        set #colorSchemeState(value) { return _private_colorSchemeState_descriptor.set.call(this, value); }
        get __colorSchemeResult() {
            return this.colorScheme === 'auto' ? this.#colorSchemeState.get() : this.colorScheme;
        }
        get isDark() {
            return this.__colorSchemeResult === 'dark';
        }
        #accessible_accessor_storage = (__runInitializers(this, _private_colorSchemeState_extraInitializers), __runInitializers(this, _accessible_initializers, false));
        /**
         * 是否启用视觉可访问性的增强，会在查询theme的时候，自动添加 accessible 查询条件
         */
        get accessible() { return this.#accessible_accessor_storage; }
        set accessible(value) { this.#accessible_accessor_storage = value; }
        __findThemeContext = (__runInitializers(this, _accessible_extraInitializers), func_remember((colorScheme) => {
            const prefersClass = [
                ...this.theme
                    .trim()
                    .split(/[\s,]+/)
                    .filter(Boolean),
                colorScheme,
            ];
            if (this.accessible) {
                prefersClass.push('accessible');
            }
            return findAppnTheme(prefersClass);
        }, (colorScheme) => this.theme + colorScheme + this.accessible));
        #themeContext_accessor_storage = __runInitializers(this, _private_themeContext_initializers, this.__findThemeContext(this.__colorSchemeResult) ?? unstyledLightTheme);
        get #themeContext() { return _private_themeContext_descriptor.get.call(this); }
        set #themeContext(value) { return _private_themeContext_descriptor.set.call(this, value); }
        get themeContext() {
            return this.#themeContext;
        }
        __transitionStyleSheet = (__runInitializers(this, _private_themeContext_extraInitializers), func_remember((cssText) => {
            const css = new CSSStyleSheet();
            css.replaceSync(cssText);
            return css;
        }, (cssText) => cssText));
        render() {
            const colorScheme = this.isDark ? 'dark' : 'light';
            this.dataset.colorScheme = colorScheme;
            const themeContext = (this.#themeContext = this.__findThemeContext(colorScheme) ?? this.#themeContext);
            this.dataset.theme = themeContext.name;
            const { font, colors, safeAreaInset, transition } = themeContext;
            let transitionCss = '';
            for (const key of obj_props(transition)) {
                const tran = transition[key];
                const enter = 'enter' in tran ? tran.enter : tran;
                const leave = 'leave' in tran ? tran.leave : tran;
                transitionCss += `--${key}-enter-ease:${enter.ease};--${key}-enter-duration:${enter.duration};--${key}-leave-ease:${leave};--${key}-leave-duration:${leave.duration};`;
            }
            if (transitionCss) {
                transitionCss = `:host{${transitionCss}}`;
            }
            const transitionStyleSheet = this.__transitionStyleSheet(transitionCss);
            const ass = getAdoptedStyleSheets(this.shadowRoot);
            ass.set('transition', transitionStyleSheet);
            return x `<style>:host{--font-style:${font.style};--font-variant-ligatures:${font.variantLigatures};--font-variant-caps:${font.variantCaps};--font-variant-numeric:${font.variantNumeric};--font-variant-east-asian:${font.variantEastAsian};--font-variant-alternates:${font.variantAlternates};--font-variant-position:${font.variantPosition};--font-variant-emoji:${font.variantEmoji};--font-weight:${font.weight};--font-stretch:${font.stretch};--font-size:${font.size};--font-family:${font.family};--font-optical-sizing:${font.opticalSizing};--font-size-adjust:${font.sizeAdjust};--font-kerning:${font.kerning};--font-feature-settings:${font.featureSettings};--font-variation-settings:${font.variationSettings};--line-height:${font.lineHeight};--color-canvas:${colors.Canvas};--color-canvas-text:${colors.CanvasText};--color-accent:${colors.Accent};--color-accent-text:${colors.AccentText};--color-red:${colors.Red};--color-orange:${colors.Orange};--color-yellow:${colors.Yellow};--color-green:${colors.Green};--color-mint:${colors.Mint};--color-teal:${colors.Teal};--color-cyan:${colors.Cyan};--color-blue:${colors.Blue};--color-indigo:${colors.Indigo};--color-purple:${colors.Purple};--color-pink:${colors.Pink};--color-brown:${colors.Brown};--grid-unit:${themeContext.gridUnit};--grid-unit-0.5:calc(var(--grid-unit) / 2);--grid-unit-2:calc(var(--grid-unit) * 2);--grid-unit-3:calc(var(--grid-unit) * 3);--grid-unit-4:calc(var(--grid-unit) * 4);--safe-area-inset-top:${safeAreaInset.top};--safe-area-inset-bottom:${safeAreaInset.bottom};--safe-area-inset-left:${safeAreaInset.left};--safe-area-inset-right:${safeAreaInset.right}}${transitionStyleSheet}</style><slot></slot>`;
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();

export { AppnThemeProviderElement };
