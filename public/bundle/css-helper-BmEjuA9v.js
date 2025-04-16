import { f as func_remember } from './func-Sj6vdvUs.js';
import { m as map_get_or_put, a as map_delete_and_get } from './map-lhWNNA3b.js';
import './decorators-D_q1KxA8.js';

/**
 * Creates a new object by including the specified keys from the provided object.
 *
 * 通过选中对象中的指定键来创建一个新的对象。
 */
/**
 * 获取对象的属性
 *
 * opts.excludeSymbols default is false
 * opts.enumerableOnly default is true
 */
const obj_props = ((a, opts) => {
    {
        const propDesMap = Object.getOwnPropertyDescriptors(a);
        const props = [];
        for (const prop in propDesMap) {
            if (propDesMap[prop].enumerable) {
                props.push(prop);
            }
        }
        return props;
    }
});
// export const obj_extends

const assMapWM = /*@__PURE__*/ new WeakMap();
/**
 * 一个 adoptedStyleSheets 的垫片实现
 */
/*@__NO_SIDE_EFFECTS__*/
const createAdoptedStyleSheets = (root = document) => {
    let dirty = false;
    const emitChange = () => {
        if (dirty) {
            return;
        }
        dirty = true;
        queueMicrotask(() => {
            dirty = false;
            // deno-lint-ignore no-self-assign
            root.adoptedStyleSheets = root.adoptedStyleSheets;
        });
    };
    const buildEmitBind = (method) => (...args) => {
        const res = root.adoptedStyleSheets[method].apply(root.adoptedStyleSheets, args);
        emitChange();
        return res;
    };
    const push = buildEmitBind("push");
    const pop = buildEmitBind("pop");
    const shift = buildEmitBind("shift");
    const unshift = buildEmitBind("unshift");
    const splice = buildEmitBind("splice");
    const remove = (item) => {
        const index = root.adoptedStyleSheets.indexOf(item);
        if (index !== -1) {
            root.adoptedStyleSheets.splice(index, 1);
            emitChange();
        }
    };
    const getMap = func_remember(() => map_get_or_put(assMapWM, root.adoptedStyleSheets, () => new Map()));
    const map_has = (key) => getMap().has(key);
    const map_set = (key, item) => {
        const map = getMap();
        const oldItem = map.get(key);
        if (oldItem !== item) {
            replace(oldItem, item);
            map.set(key, item);
        }
    };
    const map_delete = (key) => {
        const map = getMap();
        const oldItem = map_delete_and_get(map, key);
        if (oldItem != null) {
            remove(oldItem);
            return true;
        }
        return false;
    };
    const map_get = (key) => getMap().get(key);
    const toggle = (item, enable) => {
        const hasItem = root.adoptedStyleSheets.includes(item);
        if (enable === false) {
            if (hasItem) {
                remove(item);
            }
        }
        else if (enable) {
            if (!hasItem) {
                root.adoptedStyleSheets.push(item);
                emitChange();
            }
        }
        else {
            if (hasItem) {
                remove(item);
            }
            else {
                root.adoptedStyleSheets.push(item);
                emitChange();
            }
        }
    };
    const replace = (oldItem, newItem) => {
        if (oldItem == null) {
            root.adoptedStyleSheets.push(newItem);
            emitChange();
        }
        else {
            const index = root.adoptedStyleSheets.indexOf(oldItem);
            if (index !== -1) {
                root.adoptedStyleSheets.splice(index, 1, newItem);
                emitChange();
            }
        }
    };
    const methods = new Map([
        ["push", push],
        ["pop", pop],
        ["shift", shift],
        ["unshift", unshift],
        ["splice", splice],
        // 扩展数组
        ["remove", remove],
        ["toggle", toggle],
        ["replace", replace],
        // 扩展Map-like的操作
        ["has", map_has],
        ["set", map_set],
        ["delete", map_delete],
        ["get", map_get],
    ]);
    return new Proxy(root.adoptedStyleSheets, {
        get(target, prop, rec) {
            return methods.get(prop) || Reflect.get(target, prop, rec);
        },
    });
};

/**
 * Converts a JS style object (camelCase or kebab-case) to a CSS text string.
 * Handles CSS custom properties (variables).
 * @param styleProperties - The style object.
 * @returns A string of CSS rules.
 * @example
 *
 * ```ts
 * styleToCss({ backgroundColor: 'red', '--my-var': 'blue', fontSize: '16px' })
 * Returns "background-color:red;--my-var:blue;font-size:16px;"
 * ```
 */
const styleToCss = (styleProperties) => {
    let css = '';
    for (const key of obj_props(styleProperties)) {
        const css_property = key.startsWith('--') ? key : key.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
        css += `${css_property}:${styleProperties[key]};`;
    }
    return css;
};
const getDocument = (element) => {
    if (!element) {
        return document; // Default fallback
    }
    return element.nodeType !== Node.DOCUMENT_NODE
        ? // use its owner document or fallback to the global document.
            (element.ownerDocument ?? document)
        : element;
};
const ass_wn = new WeakMap();
const getAdoptedStyleSheets = (ele) => {
    if (!('adoptedStyleSheets' in ele)) {
        ele = getDocument(ele);
    }
    return map_get_or_put(ass_wn, ele, createAdoptedStyleSheets);
};

export { getAdoptedStyleSheets as g, obj_props as o, styleToCss as s };
