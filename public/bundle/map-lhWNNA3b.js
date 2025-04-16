import './decorators-D_q1KxA8.js';

/**
 * 读取一个map中的值，如果没有，就创建它
 */
const map_get_or_put = (map, key, put) => {
    let value;
    if (map.has(key)) {
        value = map.get(key);
    }
    else {
        value = put(key, map);
        map.set(key, value);
    }
    return value;
};
/**
 * 删除一个map中的值，同时返回它
 */
const map_delete_and_get = (map, key) => {
    let value;
    if (map.has(key)) {
        value = map.get(key);
        map.delete(key);
    }
    return value;
};

export { map_delete_and_get as a, map_get_or_put as m };
