/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// --- START OF FILE range-to-safe-converter.test.ts ---

import {expect} from 'chai';
import sinon from 'sinon';
import type {RangeToSafeConverterOptions} from './range-to-safe-converter'; // Import context type if needed for spy
import {rangeToSafeConverter} from './range-to-safe-converter';

suite('rangeToSafeConverter', () => {
  let warnStub: sinon.SinonStub;

  setup(() => {
    // Stub console.warn before each test
    warnStub = sinon.stub(console, 'warn');
  });

  teardown(() => {
    // Restore console.warn after each test
    warnStub.restore();
  });

  // --- Test Initialization and Error Conditions ---
  suite('Initialization and Error Handling', () => {
    test('should throw error if min > max', () => {
      expect(() => rangeToSafeConverter(10, 5)).to.throw('Invalid range: min (10) must be less than or equal to max (5).');
    });

    test('should throw error if step number <= 0', () => {
      expect(() => rangeToSafeConverter(1, 10, {step: 0})).to.throw('Invalid step value: 0. Step number must be greater than 0.');
      expect(() => rangeToSafeConverter(1, 10, {step: -1})).to.throw('Invalid step value: -1. Step number must be greater than 0.');
    });

    test('should throw error if step object unit <= 0', () => {
      expect(() => rangeToSafeConverter(1, 10, {step: {mode: 'round', unit: 0}})).to.throw('Invalid step unit: 0. Step unit must be greater than 0.');
      expect(() => rangeToSafeConverter(1, 10, {step: {mode: 'floor', unit: -2}})).to.throw('Invalid step unit: -2. Step unit must be greater than 0.');
    });

    test('should throw error for invalid step configuration', () => {
      expect(() => rangeToSafeConverter(1, 10, {step: {}} as any)).to.throw(/Invalid step configuration/);
      expect(() => rangeToSafeConverter(1, 10, {step: {mode: 'invalid'}} as any)).to.throw(/Invalid step configuration/);
      expect(() => rangeToSafeConverter(1, 10, {step: {unit: 5}} as any)).to.throw(/Invalid step configuration/);
      expect(() => rangeToSafeConverter(1, 10, {step: true} as any)).to.throw(/Invalid step configuration/);
      expect(() => rangeToSafeConverter(1, 10, {step: 'abc'} as any)).to.throw(/Invalid step configuration/);
    });

    test('should warn and use min if defaultValue is out of range (below)', () => {
      const converter = rangeToSafeConverter(10, 20, {defaultValue: 5});
      sinon.assert.calledOnceWithExactly(warnStub, 'Default value (5) is outside the range [10, 20]. Using 10 as default.');
      warnStub.resetHistory();
      expect(converter.setProperty('invalid')).to.equal(10);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 10');
    });

    test('should warn and use max if defaultValue is out of range (above)', () => {
      const converter = rangeToSafeConverter(10, 20, {defaultValue: 25});
      sinon.assert.calledOnceWithExactly(warnStub, 'Default value (25) is outside the range [10, 20]. Using 20 as default.');
      warnStub.resetHistory();
      expect(converter.setProperty('invalid')).to.equal(20);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 20');
    });

    test('should use provided defaultValue if within range', () => {
      const converter = rangeToSafeConverter(10, 20, {defaultValue: 15});
      sinon.assert.notCalled(warnStub);
      expect(converter.setProperty('invalid')).to.equal(15);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 15');
    });

    test('should use min as default if defaultValue is not provided', () => {
      const converter = rangeToSafeConverter(10, 20);
      sinon.assert.notCalled(warnStub);
      expect(converter.setProperty('invalid')).to.equal(10);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 10');
    });

    test('should handle nullable defaultValue correctly (when null)', () => {
      const converter = rangeToSafeConverter(1, 10, {nullable: true, defaultValue: null});
      sinon.assert.notCalled(warnStub);
      expect(converter.setProperty('invalid')).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: null');
      warnStub.resetHistory();
      expect(converter.fromAttribute('invalid')).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "invalid". Cannot parse to number. Using default: null');
    });

    test('should handle non-null nullable defaultValue correctly (when in range)', () => {
      const converter = rangeToSafeConverter(1, 10, {nullable: true, defaultValue: 5});
      sinon.assert.notCalled(warnStub);
      expect(converter.setProperty('invalid')).to.equal(5);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 5');
      warnStub.resetHistory();
      expect(converter.fromAttribute('invalid')).to.equal(5);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "invalid". Cannot parse to number. Using default: 5');
    });

    test('should warn and use min if nullable defaultValue is numeric but out of range (below)', () => {
      const converter = rangeToSafeConverter(10, 20, {nullable: true, defaultValue: 5});
      sinon.assert.calledOnceWithExactly(warnStub, 'Default value (5) is outside the range [10, 20]. Using 10 as default.');
      warnStub.resetHistory();
      expect(converter.setProperty('invalid')).to.equal(10);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 10');
    });

    test('should warn and use max if nullable defaultValue is numeric but out of range (above)', () => {
      const converter = rangeToSafeConverter(10, 20, {nullable: true, defaultValue: 25});
      sinon.assert.calledOnceWithExactly(warnStub, 'Default value (25) is outside the range [10, 20]. Using 20 as default.');
      warnStub.resetHistory();
      expect(converter.setProperty('invalid')).to.equal(20);
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 20');
    });

    test('should use min if defaultValue is undefined when nullable', () => {
      const converter = rangeToSafeConverter(10, 20, {nullable: true, defaultValue: undefined});
      sinon.assert.notCalled(warnStub); // Default calculation happens internally, resulting in min (10)
      expect(converter.setProperty('invalid')).to.equal(10); // Uses the calculated default (min)
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 10');
    });
  }); // End of Initialization and Error Handling suite

  // --- Test Core Conversion and Clamping (No Step) ---
  suite('Core Conversion and Clamping (No Step)', () => {
    const converter = rangeToSafeConverter(10, 90); // Default is min (10)
    const converterWithDefault = rangeToSafeConverter(10, 90, {defaultValue: 50});
    const nullableConverter = rangeToSafeConverter(10, 90, {nullable: true, defaultValue: 50});
    const nullableConverterNullDefault = rangeToSafeConverter(10, 90, {nullable: true, defaultValue: null});

    // --- setProperty Tests ---
    suite('setProperty', () => {
      test('should return the value if within range', () => {
        expect(converter.setProperty(10)).to.equal(10);
        expect(converter.setProperty(55.5)).to.equal(55.5);
        expect(converter.setProperty(90)).to.equal(90);
        sinon.assert.notCalled(warnStub);
      });

      test('should clamp the value if below min and warn', () => {
        expect(converter.setProperty(5)).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 5 clamped to range [10, 90]. Result: 10.');
      });

      test('should clamp the value if above max and warn', () => {
        expect(converter.setProperty(100)).to.equal(90);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 100 clamped to range [10, 90]. Result: 90.');
      });

      test('should return default value (min) for non-numeric input (non-nullable, no explicit default)', () => {
        expect(converter.setProperty('hello')).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 10');
        warnStub.resetHistory();
        expect(converter.setProperty(NaN)).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: 10');
        warnStub.resetHistory();
        expect(converter.setProperty(undefined)).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: undefined. Using default: 10');
        warnStub.resetHistory();
        expect(converter.setProperty(null)).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: object. Using default: 10');
      });

      test('should return explicit default value for non-numeric input (non-nullable)', () => {
        expect(converterWithDefault.setProperty('hello')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 50');
        warnStub.resetHistory();
        expect(converterWithDefault.setProperty(NaN)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: 50');
      });

      test('should return null for null/undefined input (nullable)', () => {
        expect(nullableConverter.setProperty(null)).to.be.null;
        expect(nullableConverter.setProperty(undefined)).to.be.null;
        expect(nullableConverterNullDefault.setProperty(null)).to.be.null;
        expect(nullableConverterNullDefault.setProperty(undefined)).to.be.null;
        sinon.assert.notCalled(warnStub); // This is the correct behavior for nullable setProperty(null/undefined)
      });

      test('should return default value (numeric) for other invalid inputs (nullable) and warn', () => {
        expect(nullableConverter.setProperty('world')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: 50');
        warnStub.resetHistory();
        expect(nullableConverter.setProperty(NaN)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: 50');
      });

      test('should return default value (null) for other invalid inputs (nullable) and warn', () => {
        expect(nullableConverterNullDefault.setProperty('world')).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: string. Using default: null');
        warnStub.resetHistory();
        expect(nullableConverterNullDefault.setProperty(NaN)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: null');
      });
    });

    // --- fromAttribute Tests ---
    suite('fromAttribute', () => {
      test('should parse and return the value if within range', () => {
        expect(converter.fromAttribute('10')).to.equal(10);
        expect(converter.fromAttribute('55.5')).to.equal(55.5);
        expect(converter.fromAttribute('90')).to.equal(90);
        sinon.assert.notCalled(warnStub);
      });

      test('should parse, clamp the value if below min, and warn', () => {
        expect(converter.fromAttribute('5')).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 5 clamped to range [10, 90]. Result: 10.');
      });

      test('should parse, clamp the value if above max, and warn', () => {
        expect(converter.fromAttribute('100')).to.equal(90);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 100 clamped to range [10, 90]. Result: 90.');
      });

      test('should return default value (min) for non-parsable string (non-nullable, no explicit default)', () => {
        expect(converter.fromAttribute('hello')).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "hello". Cannot parse to number. Using default: 10');
        warnStub.resetHistory();
        // Number('') is 0, gets clamped to min (10)
        expect(converter.fromAttribute('')).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 0 clamped to range [10, 90]. Result: 10.');
      });

      test('should return explicit default value for non-parsable string (non-nullable)', () => {
        expect(converterWithDefault.fromAttribute('hello')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "hello". Cannot parse to number. Using default: 50');
        warnStub.resetHistory();
        // Number('') is 0, gets clamped to min (10)
        expect(converterWithDefault.fromAttribute('')).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 0 clamped to range [10, 90]. Result: 10.');
      });

      test('should return default value (min) for null attribute (non-nullable, no explicit default)', () => {
        expect(converter.fromAttribute(null)).to.equal(10);
        sinon.assert.notCalled(warnStub); // Correct: uses default silently
      });

      test('should return explicit default value for null attribute (non-nullable)', () => {
        expect(converterWithDefault.fromAttribute(null)).to.equal(50);
        sinon.assert.notCalled(warnStub); // Correct: uses default silently
      });

      test('should return null for null attribute (nullable)', () => {
        expect(nullableConverter.fromAttribute(null)).to.be.null;
        expect(nullableConverterNullDefault.fromAttribute(null)).to.be.null;
        sinon.assert.notCalled(warnStub); // Correct: nullable allows null attribute
      });

      test('should return default value (numeric) for non-parsable string (nullable) and warn appropriately', () => {
        expect(nullableConverter.fromAttribute('world')).to.equal(50); // Uses default 50
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "world". Cannot parse to number. Using default: 50');
        warnStub.resetHistory();
        // Number('') is 0, gets clamped to min (10)
        expect(nullableConverter.fromAttribute('')).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 0 clamped to range [10, 90]. Result: 10.');
      });

      test('should return default value (null) for non-parsable string (nullable) and warn appropriately', () => {
        expect(nullableConverterNullDefault.fromAttribute('world')).to.be.null; // Uses default null
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "world". Cannot parse to number. Using default: null');
        warnStub.resetHistory();
        // Number('') is 0, gets clamped to min (10)
        expect(nullableConverterNullDefault.fromAttribute('')).to.equal(10);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 0 clamped to range [10, 90]. Result: 10.');
      });
    });
  }); // End of Core Conversion and Clamping suite

  // --- Test Stepping Functionality ---
  suite('Stepping', () => {
    // Note: step: number implies 'exact' type which maps to 'floor' mode internally via match
    suite('Step as Number (Equivalent to Floor)', () => {
      const converter = rangeToSafeConverter(0, 100, {step: 10, defaultValue: 0});
      const nullableConverter = rangeToSafeConverter(0, 100, {step: 10, nullable: true, defaultValue: null});
      const clampConverter = rangeToSafeConverter(15, 85, {step: 10, defaultValue: 20});

      test('should floor value to nearest step multiple below (setProperty)', () => {
        expect(converter.setProperty(0)).to.equal(0);
        expect(converter.setProperty(10)).to.equal(10);
        expect(converter.setProperty(50)).to.equal(50);
        expect(converter.setProperty(100)).to.equal(100);
        expect(converter.setProperty(5)).to.equal(0);
        expect(converter.setProperty(19.9)).to.equal(10);
        expect(converter.setProperty(99)).to.equal(90);
        sinon.assert.notCalled(warnStub);
      });

      test('should floor value to nearest step multiple below (fromAttribute)', () => {
        expect(converter.fromAttribute('0')).to.equal(0);
        expect(converter.fromAttribute('20')).to.equal(20);
        expect(converter.fromAttribute('90')).to.equal(90);
        expect(converter.fromAttribute('15')).to.equal(10);
        expect(converter.fromAttribute('99.9')).to.equal(90);
        sinon.assert.notCalled(warnStub);
      });

      test('should clamp *after* flooring (setProperty)', () => {
        expect(clampConverter.setProperty(12)).to.equal(15); // Step(12)=10, Clamp(10)=15
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 10 clamped to range [15, 85]. Result: 15.');
        warnStub.resetHistory();
        expect(clampConverter.setProperty(88)).to.equal(80); // Step(88)=80, Clamp(80)=80
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(clampConverter.setProperty(91)).to.equal(85); // Step(91)=90, Clamp(90)=85
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 90 clamped to range [15, 85]. Result: 85.');
      });

      test('should clamp *after* flooring (fromAttribute)', () => {
        expect(clampConverter.fromAttribute('12')).to.equal(15); // Step(12)=10, Clamp(10)=15
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 10 clamped to range [15, 85]. Result: 15.');
        warnStub.resetHistory();
        expect(clampConverter.fromAttribute('91')).to.equal(85); // Step(91)=90, Clamp(90)=85
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 90 clamped to range [15, 85]. Result: 85.');
      });

      test('should work correctly when nullable', () => {
        expect(nullableConverter.setProperty(25)).to.equal(20);
        expect(nullableConverter.setProperty(null)).to.be.null;
        expect(nullableConverter.fromAttribute('39')).to.equal(30);
        expect(nullableConverter.fromAttribute(null)).to.be.null;
        sinon.assert.notCalled(warnStub);
      });

      test('should handle floating point inaccuracies gracefully (Big.js floor)', () => {
        const floatConverter = rangeToSafeConverter(0, 1, {step: 0.1, defaultValue: 0});
        expect(floatConverter.setProperty(0.3)).to.be.closeTo(0.3, 1e-15);
        expect(floatConverter.setProperty(0.1 + 0.2)).to.be.closeTo(0.3, 1e-15);
        expect(floatConverter.setProperty(0.39999999999999997)).to.be.closeTo(0.3, 1e-15);
        expect(floatConverter.setProperty(0.4000000000000001)).to.be.closeTo(0.4, 1e-15);
        sinon.assert.notCalled(warnStub);
      });
    });

    suite('Step as Object (Mode and Unit)', () => {
      test('should round correctly (setProperty & fromAttribute)', () => {
        const converter = rangeToSafeConverter(0, 100, {step: {mode: 'round', unit: 10}, defaultValue: 0});
        expect(converter.setProperty(14)).to.equal(10);
        expect(converter.setProperty(16)).to.equal(20);
        expect(converter.setProperty(5)).to.equal(10);
        expect(converter.setProperty(4)).to.equal(0);
        expect(converter.fromAttribute('84')).to.equal(80);
        expect(converter.fromAttribute('86')).to.equal(90);
        sinon.assert.notCalled(warnStub);
      });

      test('should floor correctly (setProperty & fromAttribute)', () => {
        const converter = rangeToSafeConverter(0, 100, {step: {mode: 'floor', unit: 10}, defaultValue: 0});
        expect(converter.setProperty(19)).to.equal(10);
        expect(converter.setProperty(10)).to.equal(10);
        expect(converter.setProperty(9)).to.equal(0);
        expect(converter.fromAttribute('99')).to.equal(90);
        expect(converter.fromAttribute('90')).to.equal(90);
        sinon.assert.notCalled(warnStub);
      });

      test('should ceil correctly (setProperty & fromAttribute)', () => {
        const converter = rangeToSafeConverter(0, 100, {step: {mode: 'ceil', unit: 10}, defaultValue: 0});
        expect(converter.setProperty(11)).to.equal(20);
        expect(converter.setProperty(10)).to.equal(10);
        expect(converter.setProperty(1)).to.equal(10);
        expect(converter.setProperty(0)).to.equal(0);
        expect(converter.fromAttribute('91')).to.equal(100);
        expect(converter.fromAttribute('90')).to.equal(90);
        sinon.assert.notCalled(warnStub);
      });

      test('should handle floating point inaccuracies gracefully (Big.js round/ceil)', () => {
        const roundConverter = rangeToSafeConverter(0, 1, {step: {mode: 'round', unit: 0.1}, defaultValue: 0});
        const ceilConverter = rangeToSafeConverter(0, 1, {step: {mode: 'ceil', unit: 0.1}, defaultValue: 0});

        expect(roundConverter.setProperty(0.1 + 0.2)).to.be.closeTo(0.3, 1e-15);
        expect(roundConverter.setProperty(0.14999999999999997)).to.be.closeTo(0.1, 1e-15);
        expect(roundConverter.setProperty(0.15000000000000002)).to.be.closeTo(0.2, 1e-15);

        // Big(0.300...4).div(0.1) = 3.00...4. round(UP) = 4. times(0.1) = 0.4
        expect(ceilConverter.setProperty(0.1 + 0.2)).to.be.closeTo(0.4, 1e-15);
        expect(ceilConverter.setProperty(0.21)).to.be.closeTo(0.3, 1e-15);
        expect(ceilConverter.setProperty(0.29999999999999993)).to.be.closeTo(0.3, 1e-15); // Big(0.299...).div(0.1)=2.99... round(UP)=3
        expect(ceilConverter.setProperty(0.3000000000000001)).to.be.closeTo(0.4, 1e-15); // Big(0.300...1).div(0.1)=3.00...1 round(UP)=4

        sinon.assert.notCalled(warnStub);
      });

      test('should clamp after stepping (round)', () => {
        const converter = rangeToSafeConverter(0, 50, {step: {mode: 'round', unit: 10}, defaultValue: 0});
        expect(converter.setProperty(48)).to.equal(50); // Step(48)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converter.setProperty(51)).to.equal(50); // Step(51)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converter.setProperty(56)).to.equal(50); // Step(56)=60, Clamp(60)=50
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 60 clamped to range [0, 50]. Result: 50.');
        warnStub.resetHistory();
        expect(converter.fromAttribute('-2')).to.equal(0); // Step(-2)=0, Clamp(0)=0
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converter.fromAttribute('-6')).to.equal(0); // Step(-6)=-10, Clamp(-10)=0
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value -10 clamped to range [0, 50]. Result: 0.');
      });

      test('should clamp after stepping (floor)', () => {
        const converter = rangeToSafeConverter(10, 50, {step: {mode: 'floor', unit: 10}, defaultValue: 10});
        expect(converter.setProperty(59)).to.equal(50); // Step(59)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converter.setProperty(9)).to.equal(10); // Step(9)=0, Clamp(0)=10
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 0 clamped to range [10, 50]. Result: 10.');
      });

      test('should clamp after stepping (ceil)', () => {
        const converter = rangeToSafeConverter(0, 50, {step: {mode: 'ceil', unit: 10}, defaultValue: 0});
        expect(converter.setProperty(41)).to.equal(50); // Step(41)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converter.setProperty(51)).to.equal(50); // Step(51)=60, Clamp(60)=50
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 60 clamped to range [0, 50]. Result: 50.');
      });
    });

    suite('Step as Function', () => {
      const customStepperUndef: RangeToSafeConverterOptions.StepFunction = (v) => (v % 5 === 0 ? v : undefined);
      const customStepperNull: RangeToSafeConverterOptions.StepFunction = (v) => (v > 50 ? null : v % 2 === 0 ? v : undefined);

      const converterUndef = rangeToSafeConverter(0, 100, {step: customStepperUndef, defaultValue: 10}); // Non-nullable
      const nullableConverterNull = rangeToSafeConverter(0, 100, {
        // Nullable, default null
        step: customStepperNull,
        nullable: true,
        defaultValue: null,
      });
      const nonNullableConverterNull = rangeToSafeConverter(0, 100, {
        // Non-nullable, default 20
        step: (v) => (v > 50 ? null : v),
        defaultValue: 20,
      });
      const converterFinite = rangeToSafeConverter(0, 100, {
        // Non-nullable, default 30
        step: (v) => (v > 50 ? Infinity : v),
        defaultValue: 30,
      });

      test('should use custom step function correctly (setProperty)', () => {
        expect(converterUndef.setProperty(10)).to.equal(10);
        expect(converterUndef.setProperty(55)).to.equal(55);
        sinon.assert.notCalled(warnStub);
      });

      test('should use default value if custom step function returns undefined (setProperty, non-nullable)', () => {
        expect(converterUndef.setProperty(12)).to.equal(10); // Step(12)=undefined, not nullable -> default=10
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepping resulted in value: undefined. Using default: 10.');
      });

      test('should use custom step function correctly (fromAttribute)', () => {
        expect(converterUndef.fromAttribute('20')).to.equal(20);
        expect(converterUndef.fromAttribute('95')).to.equal(95);
        sinon.assert.notCalled(warnStub);
      });

      test('should use default value if custom step function returns undefined (fromAttribute, non-nullable)', () => {
        expect(converterUndef.fromAttribute('33')).to.equal(10); // Step(33)=undefined, not nullable -> default=10
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepping resulted in value: undefined. Using default: 10.');
      });

      test('should return null if step function returns null when nullable (setProperty)', () => {
        expect(nullableConverterNull.setProperty(60)).to.be.null; // Step(60)=null, nullable -> null
        sinon.assert.notCalled(warnStub); // Correct: no warning needed
      });

      test('should use default value if step function returns null when not nullable (setProperty)', () => {
        expect(nonNullableConverterNull.setProperty(70)).to.equal(20); // Step(70)=null, not nullable -> default=20
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepping resulted in value: null. Using default: 20.');
      });

      test('should handle valid numeric return from step function when nullable (setProperty)', () => {
        expect(nullableConverterNull.setProperty(40)).to.equal(40); // Step(40)=40, Clamp(40)=40
        sinon.assert.notCalled(warnStub);
      });

      // --- THIS IS THE CORRECTED TEST ---
      test('should return null if step function returns undefined when nullable (setProperty)', () => {
        // Input 33 -> fn returns undefined. nullable=true -> result should be null.
        expect(nullableConverterNull.setProperty(33)).to.be.null;
        // No warning is expected because when nullable is true and steppedValue is null/undefined,
        // the code explicitly returns null without warning.
        sinon.assert.notCalled(warnStub);
      });
      // --- END OF CORRECTION ---

      test('should use default value if step function returns non-finite number (setProperty)', () => {
        expect(converterFinite.setProperty(70)).to.equal(30); // Step(70)=Infinity, invalid -> default=30
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepping resulted in invalid number: Infinity. Using default: 30.');
      });

      test('should use default value if step function returns non-finite number (fromAttribute)', () => {
        expect(converterFinite.fromAttribute('70')).to.equal(30); // Step(70)=Infinity, invalid -> default=30
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepping resulted in invalid number: Infinity. Using default: 30.');
      });

      test('should provide context to step function', () => {
        const contextSpy = sinon.spy((_value: number, ctx: RangeToSafeConverterOptions.StepFunctionContext): number => {
          expect(ctx.min).to.equal(10);
          expect(ctx.max).to.equal(90);
          expect(ctx.nullable).to.be.true;
          expect(ctx.defaultValue).to.equal(50); // Internal calculated default
          expect(Object.isFrozen(ctx)).to.be.true;
          return _value;
        });
        const converterWithCtx = rangeToSafeConverter(10, 90, {
          nullable: true,
          defaultValue: 50,
          step: contextSpy,
        });

        const result1 = converterWithCtx.setProperty(60);
        expect(result1).to.equal(60);
        sinon.assert.calledOnce(contextSpy);
        expect(contextSpy.firstCall.args[0]).to.equal(60);
        expect(contextSpy.firstCall.args[1]).to.deep.equal({min: 10, max: 90, nullable: true, defaultValue: 50});

        const result2 = converterWithCtx.fromAttribute('70');
        expect(result2).to.equal(70);
        sinon.assert.calledTwice(contextSpy);
        expect(contextSpy.secondCall.args[0]).to.equal(70);
        expect(contextSpy.secondCall.args[1]).to.deep.equal({min: 10, max: 90, nullable: true, defaultValue: 50});

        sinon.assert.notCalled(warnStub);
      });

      test('should clamp after step function returns valid number', () => {
        const converter = rangeToSafeConverter(10, 50, {
          step: (v) => v * 2,
          defaultValue: 10,
        });
        expect(converter.setProperty(30)).to.equal(50); // Step(30)=60, Clamp(60)=50
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 60 clamped to range [10, 50]. Result: 50.');
        warnStub.resetHistory();
        expect(converter.setProperty(4)).to.equal(10); // Step(4)=8, Clamp(8)=10
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 8 clamped to range [10, 50]. Result: 10.');
        warnStub.resetHistory();
        expect(converter.setProperty(20)).to.equal(40); // Step(20)=40, Clamp(40)=40
        sinon.assert.notCalled(warnStub);
      });
    });
  }); // End of Stepping suite

  // --- Test toAttribute ---
  suite('toAttribute', () => {
    const converter = rangeToSafeConverter(0, 100, {defaultValue: 50});
    const nullableConverter = rangeToSafeConverter(0, 100, {nullable: true, defaultValue: null});

    test('should convert valid numbers to string', () => {
      expect(converter.toAttribute(0)).to.equal('0');
      expect(converter.toAttribute(50)).to.equal('50');
      expect(converter.toAttribute(100)).to.equal('100');
      expect(converter.toAttribute(3.14)).to.equal('3.14');
      expect(converter.toAttribute(-10.5)).to.equal('-10.5');
      sinon.assert.notCalled(warnStub);
    });

    test('should convert null to null when nullable', () => {
      expect(nullableConverter.toAttribute(null)).to.be.null;
      sinon.assert.notCalled(warnStub);
    });

    test('should return null for null when not nullable (treats as invalid) and warn', () => {
      expect(converter.toAttribute(null as any)).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: object. Returning null.');
    });

    test('should return null for non-finite numbers and warn', () => {
      expect(converter.toAttribute(NaN)).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: number. Returning null.');
      warnStub.resetHistory();
      expect(converter.toAttribute(Infinity)).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: number. Returning null.');
      warnStub.resetHistory();
      expect(converter.toAttribute(-Infinity)).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: number. Returning null.');
    });

    test('should return null for undefined and warn (non-nullable)', () => {
      expect(converter.toAttribute(undefined as any)).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: undefined. Returning null.');
    });

    test('should return null for undefined and warn (nullable)', () => {
      expect(nullableConverter.toAttribute(undefined as any)).to.be.null;
      sinon.assert.notCalled(warnStub);
    });

    test('should convert valid numbers to string when nullable', () => {
      expect(nullableConverter.toAttribute(25)).to.equal('25');
      expect(nullableConverter.toAttribute(0)).to.equal('0');
      sinon.assert.notCalled(warnStub);
    });
  }); // End of toAttribute suite

  // --- Test Edge Cases ---
  suite('Edge Cases', () => {
    suite('min === max', () => {
      const converter = rangeToSafeConverter(50, 50);
      const nullableConverter = rangeToSafeConverter(50, 50, {nullable: true, defaultValue: 50});

      test('setProperty: should return the exact value if equal', () => {
        expect(converter.setProperty(50)).to.equal(50);
        sinon.assert.notCalled(warnStub);
      });

      test('setProperty: should clamp to the exact value if different and warn', () => {
        expect(converter.setProperty(40)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 40 clamped to range [50, 50]. Result: 50.');
        warnStub.resetHistory();
        expect(converter.setProperty(60)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 60 clamped to range [50, 50]. Result: 50.');
      });

      test('setProperty: should handle nullable correctly', () => {
        expect(nullableConverter.setProperty(null)).to.be.null;
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(nullableConverter.setProperty(50)).to.equal(50);
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(nullableConverter.setProperty(51)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 51 clamped to range [50, 50]. Result: 50.');
      });

      test('fromAttribute: should return the exact value if equal', () => {
        expect(converter.fromAttribute('50')).to.equal(50);
        sinon.assert.notCalled(warnStub);
      });

      test('fromAttribute: should clamp to the exact value if different and warn', () => {
        expect(converter.fromAttribute('45')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 45 clamped to range [50, 50]. Result: 50.');
        warnStub.resetHistory();
        expect(converter.fromAttribute('55')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 55 clamped to range [50, 50]. Result: 50.');
      });

      test('fromAttribute: should handle nullable correctly', () => {
        expect(nullableConverter.fromAttribute(null)).to.be.null;
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(nullableConverter.fromAttribute('50')).to.equal(50);
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(nullableConverter.fromAttribute('49')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 49 clamped to range [50, 50]. Result: 50.');
      });

      test('min === max with step (floor/exact)', () => {
        const converterStep = rangeToSafeConverter(50, 50, {step: 10});
        expect(converterStep.setProperty(50)).to.equal(50); // Step(50)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converterStep.setProperty(40)).to.equal(50); // Step(40)=40, Clamp(40)=50
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 40 clamped to range [50, 50]. Result: 50.');
        warnStub.resetHistory();
        expect(converterStep.setProperty(55)).to.equal(50); // Step(55)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
      });

      test('min === max with step (round)', () => {
        const converterStep2 = rangeToSafeConverter(50, 50, {step: {mode: 'round', unit: 10}, defaultValue: 50});
        expect(converterStep2.setProperty(48)).to.equal(50); // Step(48)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converterStep2.setProperty(51)).to.equal(50); // Step(51)=50, Clamp(50)=50
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converterStep2.setProperty(56)).to.equal(50); // Step(56)=60, Clamp(60)=50
        sinon.assert.calledOnceWithExactly(warnStub, 'Stepped value 60 clamped to range [50, 50]. Result: 50.');
      });
    });

    suite('NaN/Infinity handling', () => {
      const converter = rangeToSafeConverter(0, 100, {defaultValue: 50});
      const nullableConverter = rangeToSafeConverter(0, 100, {nullable: true, defaultValue: null});

      test('setProperty: should use default for NaN/Infinity (non-nullable)', () => {
        expect(converter.setProperty(NaN)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: 50');
        warnStub.resetHistory();
        expect(converter.setProperty(Infinity)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: 50');
        warnStub.resetHistory();
        expect(converter.setProperty(-Infinity)).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: 50');
      });

      test('setProperty: should use default for NaN/Infinity (nullable)', () => {
        expect(nullableConverter.setProperty(NaN)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: null');
        warnStub.resetHistory();
        expect(nullableConverter.setProperty(Infinity)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: null');
        warnStub.resetHistory();
        expect(nullableConverter.setProperty(-Infinity)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid input type for setProperty: number. Using default: null');
      });

      test('fromAttribute: should use default for non-parsable/Infinity strings (non-nullable)', () => {
        expect(converter.fromAttribute('invalid')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "invalid". Cannot parse to number. Using default: 50');
        warnStub.resetHistory();
        expect(converter.fromAttribute('Infinity')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "Infinity". Cannot parse to number. Using default: 50');
        warnStub.resetHistory();
        expect(converter.fromAttribute('-Infinity')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "-Infinity". Cannot parse to number. Using default: 50');
        warnStub.resetHistory();
        expect(converter.fromAttribute('NaN')).to.equal(50);
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "NaN". Cannot parse to number. Using default: 50');
      });

      test('fromAttribute: should use default for non-parsable/Infinity strings (nullable)', () => {
        expect(nullableConverter.fromAttribute('invalid')).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "invalid". Cannot parse to number. Using default: null');
        warnStub.resetHistory();
        expect(nullableConverter.fromAttribute('Infinity')).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "Infinity". Cannot parse to number. Using default: null');
        warnStub.resetHistory();
        expect(nullableConverter.fromAttribute('-Infinity')).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "-Infinity". Cannot parse to number. Using default: null');
        warnStub.resetHistory();
        expect(nullableConverter.fromAttribute('NaN')).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid attribute value: "NaN". Cannot parse to number. Using default: null');
      });

      test('toAttribute: should return null for NaN/Infinity (and warn)', () => {
        expect(converter.toAttribute(NaN)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: number. Returning null.');
        warnStub.resetHistory();
        expect(converter.toAttribute(Infinity)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: number. Returning null.');
        warnStub.resetHistory();
        expect(nullableConverter.toAttribute(NaN)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: number. Returning null.');
        warnStub.resetHistory();
        expect(nullableConverter.toAttribute(Infinity)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, 'Invalid property value type for toAttribute: number. Returning null.');
      });
    });

    suite('Extreme numeric values', () => {
      test('should handle Number.MAX_VALUE', () => {
        const converter = rangeToSafeConverter(0, Number.MAX_VALUE);
        expect(converter.setProperty(Number.MAX_VALUE)).to.equal(Number.MAX_VALUE);
        expect(converter.fromAttribute(String(Number.MAX_VALUE))).to.equal(Number.MAX_VALUE);
        expect(converter.toAttribute(Number.MAX_VALUE)).to.equal(String(Number.MAX_VALUE));
        sinon.assert.notCalled(warnStub);
      });

      test('should handle Number.MIN_VALUE (close to zero positive)', () => {
        const converter = rangeToSafeConverter(Number.MIN_VALUE, 1, {defaultValue: 1});
        expect(converter.setProperty(Number.MIN_VALUE)).to.equal(Number.MIN_VALUE);
        expect(converter.fromAttribute(String(Number.MIN_VALUE))).to.equal(Number.MIN_VALUE);
        expect(converter.toAttribute(Number.MIN_VALUE)).to.equal(String(Number.MIN_VALUE));
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();
        expect(converter.setProperty(0)).to.equal(Number.MIN_VALUE); // Clamp(0) = min
        sinon.assert.calledOnceWithExactly(warnStub, `Stepped value 0 clamped to range [${Number.MIN_VALUE}, 1]. Result: ${Number.MIN_VALUE}.`);
      });

      test('should handle large negative numbers (-Number.MAX_VALUE)', () => {
        const converter = rangeToSafeConverter(-Number.MAX_VALUE, 0);
        expect(converter.setProperty(-Number.MAX_VALUE)).to.equal(-Number.MAX_VALUE);
        expect(converter.fromAttribute(String(-Number.MAX_VALUE))).to.equal(-Number.MAX_VALUE);
        expect(converter.toAttribute(-Number.MAX_VALUE)).to.equal(String(-Number.MAX_VALUE));
        sinon.assert.notCalled(warnStub);
      });

      test('should handle Number.MAX_SAFE_INTEGER and beyond', () => {
        const maxSafe = Number.MAX_SAFE_INTEGER;
        const beyondMaxSafe = maxSafe + 100;
        const converter = rangeToSafeConverter(0, beyondMaxSafe);
        expect(converter.setProperty(maxSafe)).to.equal(maxSafe);
        expect(converter.setProperty(beyondMaxSafe)).to.equal(beyondMaxSafe);
        sinon.assert.notCalled(warnStub);
      });

      test('should handle Number.MIN_SAFE_INTEGER and below', () => {
        const minSafe = Number.MIN_SAFE_INTEGER;
        const belowMinSafe = minSafe - 100;
        const converter = rangeToSafeConverter(belowMinSafe, 0);
        expect(converter.setProperty(minSafe)).to.equal(minSafe);
        expect(converter.setProperty(belowMinSafe)).to.equal(belowMinSafe);
        sinon.assert.notCalled(warnStub);
      });
    });
  }); // End of Edge Cases suite
}); // End of main suite
// --- END OF FILE range-to-safe-converter.test.ts ---
