import { i } from './custom-element-T1yNbIOj.js';
import { s as safeProperty } from './safe-property-BaHsMKyU.js';

/**
 * an converter for attribute/property="auto | true | false"
 */
const autoBooleanConverter = {
    setProperty: (value) => {
        if (value == null ||
            value === '' ||
            // 这里会自动转换类型
            /^auto$/i.test(value)) {
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
const autoBooleanProperty = () => {
    return safeProperty(autoBooleanConverter);
};

const translucentStyle = i `:host{background-color:var(--color-canvas)}:host([data-translucent=yes]){background-color:transparent;--_light-brightness:calc(1.5 * var(--color-scheme-light, 1));--_dark-brightness:calc(0.5 * var(--color-scheme-dark, 0));backdrop-filter:blur(20px) contrast(0.5) brightness(max(var(--_light-brightness),var(--_dark-brightness)))}`;

export { autoBooleanProperty as a, translucentStyle as t };
