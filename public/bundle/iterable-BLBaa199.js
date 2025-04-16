/**
 * 取集合第一个元素
 *
 * 注意，如果不存在，会抛出异常
 */
/**
 * 取集合第一个元素
 */
const iter_get_first_or_null = (items) => iter_get_first_or_default(items, () => void 0);
/**
 * 取集合第一个元素
 *
 * 否则取默认返回值
 */
const iter_get_first_or_default = (items, defaultValue) => {
    for (const first of items) {
        return first;
    }
    return defaultValue();
};
/**
 * 等同于 map 并且 filter 出非空元素
 *
 * 支持任何可迭代的对象
 */
const iter_map_not_null = (values, callbackfn) => {
    const result = [];
    let index = 0;
    for (const value of values) {
        const r = callbackfn(value, index++, values);
        if (r != null) {
            result.push(r);
        }
    }
    return result;
};

export { iter_get_first_or_null as a, iter_map_not_null as i };
