import {ReactiveElement} from 'lit';
import {enumProperty, type EnumConverter} from './enum-property-converter';

export type AutoBoolean = boolean | 'auto';

/**
 * an converter for attribute/property="auto | true | false"
 */
export const autoBooleanConverter: EnumConverter<AutoBoolean> = {
  setProperty: (value) => {
    if (
      value == null ||
      value === '' ||
      // 这里会自动转换类型
      /^auto$/i.test(value as string)
    ) {
      return 'auto';
    }
    return Boolean(value);
  },
  /**
   * Converts attribute string to property value (boolean | 'auto')
   */
  fromAttribute: (value) => {
    if (value === null || value === 'auto' || /^auto$/i.test(value)) {
      return 'auto';
    }

    if (/^false$/i.test(value)) {
      // Explicitly set to "false"
      return false;
    }
    // Treat presence (""), "true", or any other value as true
    // This aligns with how boolean attributes often behave if present with unexpected values.
    return true;
  },

  /**
   * Converts property value (boolean | 'auto') to attribute string or null
   */
  toAttribute: (value) => {
    // Explicitly reflect "true", "false", or "auto" based on property value
    switch (value) {
      case true:
      case false:
        return value.toString();
      // case 'auto':
      //   return value;
      default:
        return 'auto';
    }
  },
};

export const autoBooleanProperty = <C extends ReactiveElement>() => {
  return enumProperty<C, AutoBoolean>(autoBooleanConverter);
};
