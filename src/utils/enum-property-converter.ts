import {accessor} from '@gaubee/util';
import type {ReactiveElement} from 'lit';
import {property} from 'lit/decorators.js';

/**
 * 定义枚举转换器的接口
 */
export interface EnumConverter<T> {
  /**
   * 当通过 JavaScript property 设置值时调用。
   * 尝试将输入值转换为有效的枚举成员 T。
   * @param value - 尝试设置的任意值。
   * @returns T - 有效的枚举成员。如果输入无效，则返回默认值。
   */
  setProperty(value: unknown): T;

  /**
   * 当通过 HTML attribute 设置值时调用。
   * 将 attribute 字符串值（或 null）转换为有效的枚举成员 T。
   * @param value - 来自 HTML attribute 的字符串值或 null。
   * @returns T - 有效的枚举成员。如果输入无效或为 null，则返回默认值。
   */
  fromAttribute(value: string | null): T;

  /**
   * 当属性值需要转换回 HTML attribute 字符串时调用。
   * 将有效的枚举成员 T 转换为其字符串表示形式。
   * @param propertyValue - 当前的属性值（有效的枚举成员）。
   * @returns string | null - 用于设置 attribute 的字符串，或者 null（如果适用，但通常直接返回字符串）。
   */
  toAttribute(propertyValue: T): string | null;
}

export const enumProperty = <C extends ReactiveElement, T>(converter: EnumConverter<T>) => {
  const litPropertyAccessor = property({attribute: true, reflect: true, converter: converter});
  return accessor<C, T>((target, context) => {
    const litPropertyAccessorDecoratorResult = litPropertyAccessor(target, context);
    const set = litPropertyAccessorDecoratorResult.set;
    return {
      ...litPropertyAccessorDecoratorResult,
      set(value) {
        value = converter.setProperty(value);
        set?.call(this as any, value);
      },
    };
  });
};

/**
 * Configuration options for the valuesToEnumConverter function.
 */
export interface ValuesToEnumConverterOptions<T> {
  /**
   * Specifies which value from the 'values' array should be used as the default
   * when an invalid value/attribute is encountered.
   * If not provided, the first element of the 'values' array will be used.
   * The provided defaultValue MUST exist within the 'values' array.
   */
  defaultValue?: T;
}

/**
 * Creates an EnumConverter based on an array of possible values, optimized for common use cases (strings, numbers).
 *
 * It prioritizes performance for attribute lookups using pre-calculated maps.
 * - `setProperty` uses strict comparison (identity/value) against canonical values.
 * - `fromAttribute` uses a case-insensitive lookup for string representations.
 * - `toAttribute` returns the pre-calculated string representation of a canonical value.
 *
 * @param values A readonly array of valid enum values (typically strings or numbers). Use `as const` for best type safety.
 * @param options Optional configuration, supporting `defaultValue`.
 * @returns An EnumConverter instance.
 * @template T The type of the enum values.
 */
export function valuesToEnumConverter<T>(
  values: readonly T[], // Use readonly for better type inference with `as const`
  options?: ValuesToEnumConverterOptions<T>
): EnumConverter<T> {
  if (!values || values.length === 0) {
    throw new Error('valuesToEnumConverter requires a non-empty array of possible values.');
  }

  // --- Data Structure Initialization ---

  // 1. Set for fast canonical value checks (identity/value)
  const valueSet = new Set<T>(values);

  // 2. Determine and validate the default value
  const defaultValue = options?.defaultValue ?? values[0];

  if (!valueSet.has(defaultValue)) {
    throw new Error(`The effective defaultValue (${defaultValue}) is not present in the provided values array.`);
  }

  // 3. Maps for attribute conversion (optimized lookups)
  //    - attributeMap: lowercase string -> canonical value T (for fromAttribute)
  //    - valueToAttributeMap: canonical value T -> original string value (for toAttribute)
  const attributeMap = new Map<string, T>();
  const valueToAttributeMap = new Map<T, string>();

  for (const value of valueSet) {
    const stringValue = String(value); // Calculate string representation once
    const lowerCaseStringValue = stringValue.toLowerCase();

    // Populate map for toAttribute (Canonical Value -> String Representation)
    valueToAttributeMap.set(value, stringValue);

    // Populate map for fromAttribute (Lowercase String -> Canonical Value)
    if (attributeMap.has(lowerCaseStringValue)) {
      // Warn if different canonical values map to the same lowercase string
      // Example: values = ['Value', 'value']
      const existingValue = attributeMap.get(lowerCaseStringValue);
      console.warn(
        `Warning: Multiple values map to the same case-insensitive attribute string "${lowerCaseStringValue}". ` +
          `Attribute lookup will resolve to the last encountered value ("${value}"). ` +
          `Previous value was ("${existingValue}").`
      );
    }
    attributeMap.set(lowerCaseStringValue, value);
  }

  // --- Converter Implementation ---

  return {
    /**
     * Sets the property value. Performs a strict check against canonical values.
     */
    setProperty(value: unknown): T {
      // Strict check: Is the provided value *exactly* one of the canonical enum values?
      if (valueSet.has(value as T)) {
        return value as T;
      }

      // --- Removed the type coercion `==` check from the reference code ---
      // Rationale: Enums usually imply specific values. Relying on type coercion
      // (e.g., setProperty(1) matching canonical value '1') can be less predictable
      // than strict checks or explicit handling via fromAttribute.
      // If coercion is needed, it's often better handled manually or in component logic.

      console.warn(
        `Invalid value set via property: received "${value}" (type: ${typeof value}). ` +
          `Expected one of [${values.map((v) => JSON.stringify(v)).join(', ')}]. ` +
          `Using default value "${defaultValue}".`
      );
      return defaultValue;
    },

    /**
     * Converts an attribute string (case-insensitive) back to a canonical enum value.
     */
    fromAttribute(attributeValue: string | null): T {
      if (attributeValue === null) {
        // console.debug(`Attribute value is null. Using default value "${effectiveDefault}".`);
        return defaultValue;
      }

      const lowerCaseValue = attributeValue.toLowerCase();

      // Fast O(1) average lookup using the pre-calculated map
      if (attributeMap.has(lowerCaseValue)) {
        // Non-null assertion safe because we checked .has()
        return attributeMap.get(lowerCaseValue)!;
      }

      console.warn(
        `Invalid attribute value "${attributeValue}" received. ` +
          `Expected value mappable to one of [${values.map((v) => JSON.stringify(v)).join(', ')}]. ` +
          `Using default value "${defaultValue}".`
      );
      return defaultValue;
    },

    /**
     * Converts a canonical enum value to its string representation for the attribute.
     */
    toAttribute(propertyValue: T): string | null {
      // Fast O(1) average lookup using the pre-calculated map
      // This also implicitly checks if propertyValue is a valid canonical value
      if (valueToAttributeMap.has(propertyValue)) {
        // Non-null assertion safe because we checked .has()
        return valueToAttributeMap.get(propertyValue)!;
      }

      // This case means propertyValue was *not* one of the original valid enum values
      console.warn(`Invalid enum value "${propertyValue}" provided to toAttribute. ` + `Expected one of [${values.map((v) => JSON.stringify(v)).join(', ')}]. Returning null.`);
      return null; // Indicate attribute should likely be removed or not set
    },
  };
}
