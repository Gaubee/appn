/**
 * 参考 https://github.com/rauschma/set-methods-polyfill
 */

import {curryThisFn, uncurryThisFn, type CurryThisFn, type Func} from '@gaubee/util';

const iterator_iterable = <T>(items: Iterator<T> | Iterable<T>): Iterable<T> => {
  if (Symbol.iterator in items) {
    return items as Iterable<T>;
  }
  return {
    [Symbol.iterator]() {
      return items;
    },
  };
};

type AnySet = Set<any>;

const safeCurrySetFn = <F extends Func>(fn: F) => {
  type PonyfillFn = CurryThisFn<F>;
  return <P extends keyof AnySet, NativeFn = AnySet[P]>(prop: P): NativeFn extends PonyfillFn ? F : never => {
    return currySetFn(prop, fn) as any;
  };
};
const currySetFn = <F extends Func>(prop: keyof AnySet, ponyfill_fn: F): F => {
  const native_fn = Set.prototype[prop];
  if (typeof native_fn === 'function') {
    return uncurryThisFn(native_fn as Func) as F;
  }
  const polyfill_fn = curryThisFn(ponyfill_fn);
  Object.defineProperty(Set.prototype, prop, {value: polyfill_fn, writable: true, enumerable: false, configurable: true});
  return ponyfill_fn;
};

export const set_union = safeCurrySetFn(<T, U>(self: Set<T>, other: ReadonlySetLike<U>): Set<T | U> => {
  CheckSetRecord(other);
  const result = new Set<T | U>(self);
  for (const elem of iterator_iterable(other.keys())) {
    result.add(elem);
  }
  return result;
})('union');

export const set_intersection = safeCurrySetFn(<T, U>(self: Set<T>, other: ReadonlySetLike<U>): Set<T & U> => {
  CheckSetRecord(other);
  let smallerElems: Iterator<T | U> | Iterable<T | U>;
  let largerHas: ReadonlySetLike<T | U>;
  if (self.size <= other.size) {
    smallerElems = self;
    largerHas = other;
  } else {
    smallerElems = other.keys();
    largerHas = self;
  }
  const result = new Set<T & U>();

  for (const elem of iterator_iterable(smallerElems)) {
    if (largerHas.has(elem)) {
      result.add(elem as T & U);
    }
  }
  return result;
})('intersection');

export const set_difference = safeCurrySetFn(<T, U>(self: Set<T>, other: ReadonlySetLike<U>): Set<T> => {
  CheckSetRecord(other);
  const result = new Set<T>(self);
  if (self.size <= other.size) {
    for (const elem of self) {
      if (other.has(elem as any)) {
        result.delete(elem);
      }
    }
  } else {
    for (const elem of iterator_iterable(other.keys() as Iterator<T & U>)) {
      if (result.has(elem)) {
        result.delete(elem);
      }
    }
  }
  return result;
})('difference');

/**
 * - this − other ∪ other − this
 * - xor
 * - the union minus the intersection
 * - all elements that don’t exist in both Sets
 */
export const set_symmetric_difference = safeCurrySetFn(<T, U>(self: Set<T>, other: ReadonlySetLike<U>): Set<T | U> => {
  CheckSetRecord(other);
  const result = new Set<T | U>(self);
  for (const elem of iterator_iterable(other.keys())) {
    if (self.has(elem as any)) {
      // Delete elements of `this` that also exist in `other`
      result.delete(elem);
    } else {
      // Add elements of `other` that don’t exist in `this`
      result.add(elem);
    }
  }
  return result;
})('symmetricDifference');

export const set_is_subset_of = safeCurrySetFn(<T>(self: Set<T>, other: ReadonlySetLike<unknown>): boolean => {
  CheckSetRecord(other);
  for (const elem of self) {
    if (!other.has(elem)) return false;
  }
  return true;
})('isSubsetOf');

export const set_is_superset_of = safeCurrySetFn(<T>(self: Set<T>, other: ReadonlySetLike<unknown>): boolean => {
  CheckSetRecord(other);
  for (const elem of iterator_iterable(other.keys())) {
    if (!self.has(elem as any)) return false;
  }
  return true;
})('isSupersetOf');

export const set_is_disjoint_from = safeCurrySetFn(<T>(self: Set<T>, other: ReadonlySetLike<T>): boolean => {
  CheckSetRecord(other);
  if (self.size <= other.size) {
    for (const elem of self) {
      if (other.has(elem)) return false;
    }
  } else {
    for (const elem of iterator_iterable(other.keys())) {
      if (self.has(elem)) return false;
    }
  }
  return true;
})('isDisjointFrom');

/**
 * A simpler version of GetSetRecord that only performs checks.
 */
function CheckSetRecord<T>(obj: ReadonlySetLike<T>): void {
  if (!isObject(obj)) {
    throw new TypeError();
  }
  const rawSize = obj.size;
  const numSize = Number(rawSize);
  // NaN if rawSize is `undefined`
  if (Number.isNaN(numSize)) {
    throw new TypeError();
  }
  // const intSize = ToIntegerOrInfinity(numSize);
  if (typeof obj.has !== 'function') {
    throw new TypeError();
  }
  if (typeof obj.keys !== 'function') {
    throw new TypeError();
  }
}

function isObject(value: unknown) {
  if (value === null) return false;
  const t = typeof value;
  return t === 'object' || t === 'function';
}

// export const set_union = uncurryThisFn(_union);
// export const set_intersection = uncurryThisFn(_intersection);
// export const set_difference = uncurryThisFn(_difference);
// export const set_symmetric_difference = uncurryThisFn(_symmetricDifference);

// export const set_is_subset_of = uncurryThisFn(_isSubsetOf);
// export const set_is_superset_of = uncurryThisFn(_isSupersetOf);
// export const set_is_disjoint_from = uncurryThisFn(_isDisjointFrom);
