import { n } from './create-context-CT4pxGTb.js';
import { m as map_get_or_put } from './map-lhWNNA3b.js';
import { a as iter_get_first_or_null } from './iterable-BLBaa199.js';

// istanbul ignore next
const isObject = (obj) => {
    if (typeof obj === "object" && obj !== null) {
        if (typeof Object.getPrototypeOf === "function") {
            const prototype = Object.getPrototypeOf(obj);
            return prototype === Object.prototype || prototype === null;
        }
        return Object.prototype.toString.call(obj) === "[object Object]";
    }
    return false;
};
const merge = (...objects) => objects.reduce((result, current) => {
    if (Array.isArray(current)) {
        throw new TypeError("Arguments provided to ts-deepmerge must be objects, not arrays.");
    }
    Object.keys(current).forEach((key) => {
        if (["__proto__", "constructor", "prototype"].includes(key)) {
            return;
        }
        if (Array.isArray(result[key]) && Array.isArray(current[key])) {
            result[key] = merge.options.mergeArrays
                ? merge.options.uniqueArrayItems
                    ? Array.from(new Set(result[key].concat(current[key])))
                    : [...result[key], ...current[key]]
                : current[key];
        }
        else if (isObject(result[key]) && isObject(current[key])) {
            result[key] = merge(result[key], current[key]);
        }
        else {
            result[key] =
                current[key] === undefined
                    ? merge.options.allowUndefinedOverrides
                        ? current[key]
                        : result[key]
                    : current[key];
        }
    });
    return result;
}, {});
const defaultOptions = {
    allowUndefinedOverrides: true,
    mergeArrays: true,
    uniqueArrayItems: true,
};
merge.options = defaultOptions;
merge.withOptions = (options, ...objects) => {
    merge.options = Object.assign(Object.assign({}, defaultOptions), options);
    const result = merge(...objects);
    merge.options = defaultOptions;
    return result;
};

/**
 * 混合theme，遵循后来者居上的优先级
 *
 * 混合规则：
 * 1. undefined 的值不会被采用
 * 2. array 不混发生混合。所以像class这种数组对象，只会采取最后一个theme的值
 * @param base
 * @param exts
 * @returns
 */
const appnThemeMixin = (base, ...exts) => {
    return merge.withOptions({ mergeArrays: false, allowUndefinedOverrides: false }, base, ...exts);
};
const appnThemeContext = n(Symbol('appn-theme'));
const allAppnThemes = new Map();
/**
 * 获取所有的主题
 * @returns
 */
const getAllAppnThemes = () => [...new Set([...allAppnThemes.values()].map((themes) => [...themes]).flat())];
/**
 * 注册主题
 * @param themes
 */
const registerAppnTheme = (...themes) => {
    for (const theme of themes) {
        for (const className of theme.class) {
            const themes = map_get_or_put(allAppnThemes, className, () => new Set());
            themes.add(theme);
        }
    }
};
/**
 * 查询主题
 * @param prefersClass
 * @returns
 */
const findAppnTheme = (prefersClass) => {
    let founds;
    for (const className of prefersClass) {
        const themes = allAppnThemes.get(className);
        if (themes == null || themes.size === 0) {
            continue;
        }
        if (null == founds) {
            founds = themes;
            continue;
        }
        /// 如果有交集，那么采用交集，否则跳过这个className，使用下一个className继续寻找
        const both = themes.intersection(founds);
        if (both.size === 0) {
            continue;
        }
        else {
            founds = both;
        }
    }
    return founds ? iter_get_first_or_null(founds) : undefined;
};

export { appnThemeContext as a, appnThemeMixin as b, findAppnTheme as f, getAllAppnThemes as g, registerAppnTheme as r };
