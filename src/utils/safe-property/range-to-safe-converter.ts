/**
 * Configuration options for the rangeToSafeConverter function.
 */

import Big from 'big.js';
import {match, P} from 'ts-pattern';
import type {SafeReflectPropertyConverter} from '../safe-property';

export interface RangeToSafeConverterOptions {
  defaultValue?: number | null;
  step?: RangeToSafeConverterOptions.StepParam;
  nullable?: boolean;
  numberify?: (value: string) => number;
  stringify?: (value: number) => string;
}
export namespace RangeToSafeConverterOptions {
  export type StepMode = 'ceil' | 'floor' | 'round';
  export type StepFunctionContext = Readonly<{min: number; max: number; nullable?: boolean; defaultValue?: number | null}>;
  export type StepFunction = (value: number, ctx: StepFunctionContext) => number | undefined | null;

  export type StepObject = {mode: StepMode; unit: number};
  export type StepParam = number | StepObject | StepFunction;

  // Internal normalized step representation
  export type NormalizedStep = {type: 'exact'; unit: number} | {type: 'mode'; mode: StepMode; unit: number} | {type: 'function'; fn: StepFunction};
}

interface RangeToSafeConverter {
  (min: number, max: number, options: RangeToSafeConverterOptions & {nullable: true}): SafeReflectPropertyConverter<number | null>;
  (min: number, max: number, options?: RangeToSafeConverterOptions): SafeReflectPropertyConverter<number>;
}

function normalizeStep(stepParam: RangeToSafeConverterOptions.StepParam | undefined): RangeToSafeConverterOptions.NormalizedStep | undefined {
  if (stepParam === undefined) {
    return undefined;
  }

  if (typeof stepParam === 'number') {
    if (stepParam <= 0) {
      throw new Error(`Invalid step value: ${stepParam}. Step number must be greater than 0.`);
    }
    return {type: 'exact', unit: stepParam};
  }

  if (typeof stepParam === 'function') {
    return {type: 'function', fn: stepParam};
  }

  if (typeof stepParam === 'object' && stepParam !== null && 'mode' in stepParam && 'unit' in stepParam) {
    if (stepParam.unit <= 0) {
      throw new Error(`Invalid step unit: ${stepParam.unit}. Step unit must be greater than 0.`);
    }
    return {type: 'mode', mode: stepParam.mode, unit: stepParam.unit};
  }

  throw new Error(`Invalid step configuration: ${JSON.stringify(stepParam)}`);
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export const rangeToSafeConverter = ((min: number, max: number, options: RangeToSafeConverterOptions = {}) => {
  if (min > max) {
    throw new Error(`Invalid range: min (${min}) must be less than or equal to max (${max}).`);
  }

  const normalizedStep = normalizeStep(options.step);
  const {nullable, numberify = Number, stringify = String} = options;

  // Calculate and validate default value
  const providedOrDefault = options.defaultValue === undefined ? min : options.defaultValue;
  let defaultValue: number | null = nullable && providedOrDefault === null ? null : typeof providedOrDefault === 'number' ? providedOrDefault : min;

  // Final validation of default value
  if (defaultValue !== null && (defaultValue < min || defaultValue > max)) {
    const resetDefaultValue = defaultValue < min ? min : max;
    console.warn(`Default value (${defaultValue}) is outside the range [${min}, ${max}]. Using ${resetDefaultValue} as default.`);
    defaultValue = resetDefaultValue;
  }

  // Create context once for step functions
  const ctx: RangeToSafeConverterOptions.StepFunctionContext = Object.freeze({
    min,
    max,
    nullable,
    defaultValue,
  });

  /**
   * Applies stepping logic to a numeric value
   * Pre-computes the stepping function based on normalizedStep to avoid repeated pattern matching
   */
  type SteppingFunction = (value: number) => number | undefined | null;
  /**
   * 使用 js 进行数学会导致精度问题，比如 Math.floor(0.3/0.1) = 2.9999999999999996 => Math.floor(2.9999999999999996) = 2
   * 因此这里统一通过引入 big.js 来计算，避免出现精度问题
   */
  const applyStepping = match<typeof normalizedStep, SteppingFunction>(normalizedStep)
    .with(P.nullish, () => (value) => value)
    .with({type: 'exact'}, {type: 'mode', mode: 'floor'}, ({unit}) => (value) => {
      return new Big(value).div(unit).round(0, Big.roundDown).times(unit).toNumber();
    })
    .with({type: 'mode', mode: 'ceil'}, ({unit}) => (value) => {
      return new Big(value).div(unit).round(0, Big.roundUp).times(unit).toNumber();
    })
    .with({type: 'mode', mode: 'round'}, ({unit}) => (value) => {
      return new Big(value).div(unit).round(0, Big.roundHalfUp).times(unit).toNumber();
    })
    .with({type: 'function'}, ({fn}) => (value) => {
      return fn(value, ctx);
    })
    .exhaustive();

  /**
   * Processes a value through stepping, validation, and clamping
   */
  const processValue = (value: number): number | null => {
    // Apply stepping
    const steppedValue = applyStepping(value);

    // Handle undefined (step mismatch)
    // Handle null/undefined result from stepping function
    if (steppedValue == null) {
      if (nullable) {
        return null;
      }
      console.warn(`Stepping resulted in value: ${steppedValue}. Using default: ${defaultValue}.`);
      return defaultValue;
    }

    // Handle invalid number
    if (!Number.isFinite(steppedValue)) {
      console.warn(`Stepping resulted in invalid number: ${steppedValue}. Using default: ${defaultValue}.`);
      return defaultValue;
    }

    // Clamp value to range
    const clampedValue = Math.max(min, Math.min(steppedValue, max));

    // Return with warning if clamping occurred
    if (clampedValue !== steppedValue) {
      console.warn(`Stepped value ${steppedValue} clamped to range [${min}, ${max}]. Result: ${clampedValue}.`);
    }
    return clampedValue;
  };

  return {
    setProperty(value: unknown): number | null {
      // Handle null/undefined values
      if (nullable && value == null) {
        return null;
      }

      // Handle non-numeric values
      const valueOfNumber = typeof value === 'number' ? value : numberify(String(value));

      if (!Number.isFinite(valueOfNumber)) {
        console.warn(`Invalid input type for setProperty: ${typeof value}. Using default: ${defaultValue}`);
        return defaultValue;
      }

      // Process the value through stepping, validation, and clamping
      return processValue(valueOfNumber);
    },

    fromAttribute(attributeValue: string | null): number | null {
      // Handle null values
      if (nullable && attributeValue == null) {
        return null;
      }

      if (attributeValue === null) {
        return defaultValue;
      }

      // Parse the attribute value
      const parsedValue = numberify(attributeValue);
      if (isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
        console.warn(`Invalid attribute value: "${attributeValue}". Cannot parse to number. Using default: ${defaultValue}`);
        return defaultValue;
      }

      // Process the parsed value
      return processValue(parsedValue);
    },

    toAttribute(propertyValue: number | null): string | null {
      // Handle null values
      if (nullable && propertyValue == null) {
        return null;
      }

      // Validate the property value
      if (!Number.isFinite(propertyValue)) {
        console.warn(`Invalid property value type for toAttribute: ${typeof propertyValue}. Returning null.`);
        return null;
      }

      // Convert to string
      return propertyValue == null ? propertyValue : stringify(propertyValue);
    },
  };
}) as RangeToSafeConverter;

export const percentageToSafeConverter = rangeToSafeConverter(0, 1, {
  nullable: true,
  numberify(value) {
    if (value.endsWith('%')) {
      return +value.slice(0, -1) / 100;
    }
    return +value;
  },
  stringify(value) {
    return `${value * 100}%`;
  },
});
