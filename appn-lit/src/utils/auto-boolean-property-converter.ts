import {accessor} from '@gaubee/util';
import {ReactiveElement, type ComplexAttributeConverter} from 'lit';
import {property} from 'lit/decorators.js';

export type AutoBoolean = boolean | 'auto';
// Define the default value for the property
const TRANSLUCENT_DEFAULT_VALUE: AutoBoolean = 'auto';

// Define the custom converter based on the draggable attribute pattern
export const autoBooleanConverter: ComplexAttributeConverter<AutoBoolean> = {
  /**
   * Converts attribute string to property value (boolean | 'auto')
   */
  fromAttribute: (value) => {
    if (value === null) {
      // Attribute is absent, return the default property value
      return TRANSLUCENT_DEFAULT_VALUE;
    }
    const lowerCaseValue = value.toLowerCase();
    if (lowerCaseValue === 'auto') {
      return 'auto';
    }
    if (lowerCaseValue === 'false') {
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
    if (value === true) {
      return 'true';
    }
    if (value === false) {
      return 'false';
    }
    if (value === 'auto') {
      return 'auto';
    }
    // If the property is set to undefined or null, remove the attribute.
    // This depends on desired behavior - alternatively, you could reflect the default value's attribute.
    // Removing seems cleaner if the property is explicitly unset.
    return 'auto';
  },
};

export const autoBooleanProperty = <C extends ReactiveElement>(isAuto = (value: unknown): boolean => value === 'auto' || value == null) => {
  const litPropertyAccessor = property({attribute: true, reflect: true, converter: autoBooleanConverter});
  return accessor<C, AutoBoolean>((target, context) => {
    const litPropertyAccessorDecoratorResult = litPropertyAccessor(target, context);
    const set = litPropertyAccessorDecoratorResult.set;
    return {
      ...litPropertyAccessorDecoratorResult,
      set(value) {
        if (!isAuto(value)) {
          value = !!value;
        }
        set?.call(this as any, value);
      },
    };
  });
};
