import {arr_remove_first, func_lazy, map_get_or_put} from '@gaubee/util';

const binds_offs_wm = /*@__PURE__*/ new WeakMap<
  Element,
  WeakMap<EventListener, (() => void)[]>
>();
const addOff = (ele: Element, handler: EventListener, off: () => void) => {
  const binds = map_get_or_put(binds_offs_wm, ele, () => new WeakMap());
  const offs = map_get_or_put(binds, handler, () => []);
  offs.push(off);
};
const getAndRemoveOff = (
  ele: Element,
  handler: EventListener,
  off?: () => void
) => {
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
  } else {
    arr_remove_first(offs, off);
  }

  return off;
};
export const caniuseScrollEnd =
  typeof window == 'undefined' ? true : 'onscrollend' in window;
export const removeScrollendEventListener = func_lazy<
  (ele: Element, handler: EventListener) => void
>(() => {
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
export const addScrollendEventListener = func_lazy<
  (ele: Element, handler: EventListener) => void
>(() => {
  if (caniuseScrollEnd) {
    return (ele, handler) => {
      ele.addEventListener('scrollend', handler);
      return () => ele.removeEventListener('scrollend', handler);
    };
  }
  // Map of scroll-observed elements.
  const observed = new WeakMap<Element, ReturnType<typeof createScrollOb>>();
  const pointers = new Set();
  // Track if any pointer is active
  document.addEventListener(
    'touchstart',
    (e) => {
      for (const touch of e.changedTouches) pointers.add(touch.identifier);
    },
    {passive: true}
  );

  document.addEventListener(
    'touchend',
    (e) => {
      for (const touch of e.changedTouches) pointers.delete(touch.identifier);
    },
    {passive: true}
  );

  document.addEventListener(
    'touchcancel',
    (e) => {
      for (const touch of e.changedTouches) pointers.delete(touch.identifier);
    },
    {passive: true}
  );

  document.addEventListener(
    'pointerdown',
    (e) => {
      pointers.add(e.pointerId);
    },
    {passive: true}
  );
  document.addEventListener(
    'pointerup',
    (e) => {
      pointers.delete(e.pointerId);
    },
    {passive: true}
  );
  document.addEventListener(
    'pointercancel',
    (e) => {
      pointers.delete(e.pointerId);
    },
    {passive: true}
  );
  const createScrollOb = (ele: Element) => {
    const scrollOb = {
      scrollport: ele,
      timeout: 0,
      scrollListener: (_evt: Event) => {
        clearTimeout(scrollOb.timeout);
        scrollOb.timeout = setTimeout(() => {
          if (pointers.size) {
            // if pointer(s) are down, wait longer
            setTimeout(scrollOb.scrollListener, 100);
          } else {
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
