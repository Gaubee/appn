import { n } from './property-CF65yZga.js';
import { a as accessor } from './decorators-D_q1KxA8.js';

const safeProperty = (safeConverter) => {
    const { setProperty, getProperty } = safeConverter;
    let { fromAttribute: fromAttribute, toAttribute: toAttribute, attribute, state } = safeConverter;
    const reflect = !!toAttribute;
    let self;
    let needSelf = false;
    if (typeof toAttribute === 'function') {
        const _toAttribute = toAttribute;
        toAttribute = (propertyValue) => _toAttribute.call(self, propertyValue);
        needSelf = true;
    }
    if (typeof fromAttribute === 'function') {
        const _fromAttribute = fromAttribute;
        fromAttribute = (value) => _fromAttribute.call(self, value);
        needSelf = true;
    }
    const converter = typeof toAttribute === 'function'
        ? //
            { fromAttribute, toAttribute }
        : { fromAttribute };
    const litPropertyAccessor = n({
        attribute: attribute ?? true,
        reflect: reflect,
        converter: converter,
        state: state ?? true,
    });
    return accessor((target, context) => {
        const litPropertyAccessorDecoratorResult = litPropertyAccessor(target, context);
        if (needSelf) {
            context.addInitializer(function () {
                self = this;
            });
        }
        const set = litPropertyAccessorDecoratorResult.set;
        const newDecorator = {
            ...litPropertyAccessorDecoratorResult,
            set(value) {
                value = setProperty.call(this, value);
                set?.call(this, value);
            },
        };
        if (typeof getProperty === 'function') {
            newDecorator.get = getProperty;
        }
        return newDecorator;
    });
};

export { safeProperty as s };
