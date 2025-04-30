import type {ReactiveElement} from 'lit';
import {type SafeReflectPropertyConverter} from '../safe-property';

export const stringOrNullConverter = <C extends ReactiveElement>(opts: {attribute?: string} = {}) => {
  const converter: SafeReflectPropertyConverter<string | null, C> = {
    ...opts,
    setProperty: (value) => {
      if (value == null) {
        return null;
      }
      return String(value);
    },
    fromAttribute: (value) => {
      return value;
    },
    toAttribute: (value) => {
      if (value == null) {
        return null;
      }
      return String(value);
    },
  };
  return converter;
};
