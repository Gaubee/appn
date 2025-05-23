import {accessor} from '@gaubee/util';
import type {ComplexAttributeConverter, ReactiveElement} from 'lit';
import {property} from 'lit/decorators.js';

/**
 * 定义枚举转换器的接口
 */
export type SafePropertyConverter<T, C = unknown> = SafeReflectPropertyConverter<T, C> | SafeNoReflectPropertyConverter<T, C>;
export type SafeNoReflectPropertyConverter<T, C = unknown> = Omit<SafeReflectPropertyConverter<T, C>, 'toAttribute'> & {
  /**
   * 当该值为false时，关闭 property => attribute 的反射。
   */
  toAttribute: false;
};
export interface SafeReflectPropertyConverter<T, C = unknown> {
  /**
   * 当通过 JavaScript property 设置值时调用。
   * 尝试将输入值转换为有效的枚举成员 T。
   * @param value - 尝试设置的任意值。
   * @returns T - 有效的枚举成员。如果输入无效，则返回默认值。
   */
  setProperty: (this: C, value: unknown) => T;
  getProperty?: (this: C) => T;

  attribute?: string;
  state?: boolean;

  /**
   * 当通过 HTML attribute 设置值时调用。
   * 将 attribute 字符串值（或 null）转换为有效的枚举成员 T。
   * @param value - 来自 HTML attribute 的字符串值或 null。
   * @returns T - 有效的枚举成员。如果输入无效或为 null，则返回默认值。
   */
  fromAttribute: (this: C, value: string | null) => T;

  /**
   * 当属性值需要转换回 HTML attribute 字符串时调用。
   * 将有效的枚举成员 T 转换为其字符串表示形式。
   * @param propertyValue - 当前的属性值（有效的枚举成员）。
   * @returns string | null - 用于设置 attribute 的字符串，或者 null（如果适用，但通常直接返回字符串）。
   */
  toAttribute: (this: C, propertyValue: T) => string | null;
}

export const safeProperty = <C extends ReactiveElement, T>(safeConverter: SafePropertyConverter<T, C>) => {
  const {setProperty, getProperty} = safeConverter;
  let {fromAttribute: fromAttribute, toAttribute: toAttribute, attribute, state} = safeConverter;
  const reflect = !!toAttribute;

  let self!: C;
  let needSelf = false;
  if (typeof toAttribute === 'function') {
    const _toAttribute = toAttribute;
    toAttribute = (propertyValue: T) => _toAttribute.call(self, propertyValue);
    needSelf = true;
  }
  if (typeof fromAttribute === 'function') {
    const _fromAttribute = fromAttribute;
    fromAttribute = (value: string | null) => _fromAttribute.call(self, value);
    needSelf = true;
  }
  const converter: ComplexAttributeConverter<T> =
    typeof toAttribute === 'function'
      ? //
        {fromAttribute, toAttribute}
      : {fromAttribute};
  const litPropertyAccessor = property({
    attribute: attribute ?? true,
    reflect: reflect,
    converter: converter,
    state: state ?? true,
  });
  return accessor<C, T>((target, context) => {
    const litPropertyAccessorDecoratorResult = litPropertyAccessor(target, context);

    if (needSelf) {
      context.addInitializer(function () {
        self = this;
      });
    }

    const set = litPropertyAccessorDecoratorResult.set;
    const newDecorator: ClassAccessorDecoratorResult<C, T> = {
      ...litPropertyAccessorDecoratorResult,
      set(value) {
        value = setProperty.call(this, value);
        set?.call(this as any, value);
      },
    };

    if (typeof getProperty === 'function') {
      newDecorator.get = getProperty;
    }

    return newDecorator;
  });
};
