import {accessor, map_get_or_put, safeAccessor} from '@gaubee/util';
import type {ReactiveElement} from 'lit';
import {safeProperty} from './safe-property';

export type PropertyEventListener<T = GlobalEventHandlers, E extends Event = Event> = ((this: T, event: E) => void) | null;
const listeners = /*@__PURE__*/ new WeakMap<object, Map<string, EventListenerObject>>();
export const eventProperty = <
  /** This */
  C extends ReactiveElement,
  /** EventType */
  E extends Event = Event,
  P extends PropertyEventListener<C, E> = PropertyEventListener<C, E>,
>(
  /**
   * 自定义eventName，否则会使用属性的名称来获得eventName，比如 onhi => "hi"
   */
  eventName?: string,
  opts: {override?: boolean} = {}
) => {
  return accessor<C, P>((target, context) => {
    const eventPorperty = event<C, E, P>(eventName, opts)(target, context);
    if (!eventPorperty) {
      return;
    }

    return safeProperty<C, P>({
      setProperty: eventPorperty.set,
      getProperty: eventPorperty.get,
      fromAttribute(value) {
        if (value != null) {
          const fun = Function('event', value) as EventListener;
          this.addEventListener(eventPorperty.eventType, fun);
        }
        return context.access.get(this); // no change
      },
      toAttribute: false,
    })(target, context);
  });
};

export const event = <
  /** This */
  C extends EventTarget,
  /** EventType */
  E extends Event = Event,
  P extends PropertyEventListener<C, E> = PropertyEventListener<C, E>,
>(
  /**
   * 自定义eventName，否则会使用属性的名称来获得eventName，比如 onhi => "hi"
   */ eventName?: string,
  opts: {override?: boolean} = {}
) => {
  return safeAccessor<C, P>()((target, context) => {
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

    return {
      eventType,
      get() {
        const instanceMap = listeners.get(this);
        const currentListener = instanceMap?.get(eventType);
        return (currentListener?.handleEvent ?? null) as P;
      },
      set(value: unknown) {
        // 获取实例的监听器映射
        const instanceMap = map_get_or_put(listeners, this, () => new Map());

        const oldListener = instanceMap.get(eventType);

        // 绑定监听器
        if (
          typeof value === 'function' ||
          /**
           * 浏览器的实现中，onxxxx 就是能绑定object，非常奇葩（可能是判断 typeof null === 'object'😂）
           * 这里只能去做兼容
           */
          (typeof value === 'object' && value !== null)
        ) {
          // 替换监听器（因为更换合法对象并不会改变事件绑定的顺序，所以这里直接替换，而不是删除后重新绑定）
          if (oldListener) {
            oldListener.handleEvent = value as EventListener;
          } else {
            // 添加监听器
            const listener = {handleEvent: value} as EventListenerObject;
            this.addEventListener(eventType, listener);
            instanceMap.set(eventType, listener);
          }
        } else {
          // 清理旧监听器
          if (oldListener) {
            this.removeEventListener(eventType, oldListener);
            instanceMap.delete(eventType);
          }
          value = null;
        }

        return value as P;
      },
    } as const;
  });
};
