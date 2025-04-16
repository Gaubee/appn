import './decorators-D_q1KxA8.js';

/**
 * 让一个函数的返回结果是缓存的
 * @param key 自定义缓存key生成器，如果生成的key不一样，那么缓存失效
 * @returns
 */
/*@__NO_SIDE_EFFECTS__*/
const func_remember = (func, key) => {
    let result;
    const once_fn = function (...args) {
        const newKey = key?.apply(this, args);
        if (result === undefined || newKey !== result.key) {
            result = {
                key: newKey,
                res: func.apply(this, args),
            };
        }
        return result.res;
    };
    const once_fn_mix = Object.assign(once_fn, {
        /// 注意，这的get
        get source() {
            return func;
        },
        get key() {
            return result?.key;
        },
        get runned() {
            return result != null;
        },
        get returnValue() {
            return result?.res;
        },
        reset() {
            result = undefined;
        },
        rerun(...args) {
            once_fn_mix.reset();
            return once_fn_mix(...args);
        },
    });
    Object.defineProperties(once_fn_mix, {
        source: { value: func, writable: false, configurable: true, enumerable: true },
        key: { get: () => result?.key, configurable: true, enumerable: true },
        runned: { get: () => result != null, configurable: true, enumerable: true },
        returnValue: { get: () => result?.res, configurable: true, enumerable: true },
    });
    return once_fn_mix;
};
/**
 * 一个能延迟执行的函数包裹
 * 和 func_remember 不同，`func_lazy(...args)` 等同于 `func_remember()(...args)`
 * @param factory
 * @returns
 */
/*@__NO_SIDE_EFFECTS__*/
const func_lazy = (factory) => {
    let fn;
    return new Proxy(factory, {
        apply(_, thisArg, argArray) {
            if (fn == undefined) {
                fn = Reflect.apply(factory, thisArg, argArray);
            }
            return Reflect.apply(fn, thisArg, argArray);
        },
    });
};

export { func_lazy as a, func_remember as f };
