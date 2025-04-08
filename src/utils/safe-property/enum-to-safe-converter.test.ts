// --- START OF FILE enum-to-safe-converter.test.ts ---

import {expect} from 'chai';
import sinon from 'sinon';
// Adjust the import path as necessary
import type {SafeReflectPropertyConverter} from '../safe-property'; // Assuming path
import {enumToSafeConverter} from './enum-to-safe-converter';

suite('enumToSafeConverter', () => {
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
    test('should throw error if values array is empty', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => enumToSafeConverter([] as any)).to.throw('valuesToEnumConverter requires a non-empty array of possible values.');
    });

    test('should throw error if explicit defaultValue is not in values (string)', () => {
      const values = ['a', 'b'] as const;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => enumToSafeConverter(values, {defaultValue: 'c' as any})).to.throw('The effective defaultValue (c) is not present in the provided values array.');
    });

    test('should throw error if explicit defaultValue is not in values (number)', () => {
      const values = [1, 2] as const;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => enumToSafeConverter(values, {defaultValue: 3 as any})).to.throw('The effective defaultValue (3) is not present in the provided values array.');
    });

    test('should throw error if explicit defaultValue is not in values (object identity)', () => {
      const objA = {id: 1};
      const objB = {id: 2};
      const values = [objA, objB] as const;
      const differentObjB = {id: 2}; // Different identity
      expect(() => enumToSafeConverter(values, {defaultValue: differentObjB})).to.throw(/The effective defaultValue \(.*\) is not present in the provided values array./); // Match error message pattern
    });

    test('should warn during initialization if values map to same lowercase string', () => {
      const values = ['UP', 'down', 'up'] as const;
      enumToSafeConverter(values); // Default is 'UP'
      // Expect warning about 'up' collision during map creation
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Warning: Multiple values map to the same case-insensitive attribute string: up/));
    });

    test('should use first value as default if defaultValue option is not provided', () => {
      const values = [100, 200, 300] as const;
      const converter = enumToSafeConverter(values);
      expect(converter.setProperty('invalid')).to.equal(100); // Uses first value (100) as default
      // Check warning message reflects the default being used
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Using default value "100"/));
    });

    test('should successfully initialize with a valid explicit defaultValue', () => {
      const values = ['x', 'y', 'z'] as const;
      expect(() => enumToSafeConverter(values, {defaultValue: 'y'})).not.to.throw();
      sinon.assert.notCalled(warnStub); // No warnings expected
    });
  }); // End of Initialization Suite

  // --- Test Scenario: Simple String Values ---
  suite('with simple string values (all lowercase)', () => {
    const colors = ['red', 'green', 'blue'] as const;
    type Color = (typeof colors)[number];
    let converter: SafeReflectPropertyConverter<Color>;

    setup(() => {
      // Create converter fresh for each test in this suite
      converter = enumToSafeConverter<Color>(colors); // Default: 'red'
      warnStub.resetHistory(); // Reset history after potential init warnings (none expected here)
    });

    suite('setProperty (strict check)', () => {
      test('should return the value if it matches exactly', () => {
        expect(converter.setProperty('green')).to.equal('green');
        expect(converter.setProperty('red')).to.equal('red');
        sinon.assert.notCalled(warnStub);
      });

      test('should return default and warn for case mismatch or invalid string', () => {
        expect(converter.setProperty('RED')).to.equal('red'); // Default 'red'
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "RED".*Using default value "red"/));
        warnStub.resetHistory();

        expect(converter.setProperty('yellow')).to.equal('red');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "yellow".*Using default value "red"/));
      });

      test('should return default and warn for non-string types', () => {
        expect(converter.setProperty(1)).to.equal('red');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "1".*Using default value "red"/));
        warnStub.resetHistory();

        expect(converter.setProperty(null)).to.equal('red');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "null".*Using default value "red"/));
        warnStub.resetHistory();

        expect(converter.setProperty(undefined)).to.equal('red');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "undefined".*Using default value "red"/));
      });
    });

    suite('fromAttribute (case-insensitive map lookup)', () => {
      test('should return canonical value for exact match', () => {
        expect(converter.fromAttribute('green')).to.equal('green');
        sinon.assert.notCalled(warnStub);
      });

      test('should return canonical value for case-insensitive match', () => {
        expect(converter.fromAttribute('RED')).to.equal('red');
        expect(converter.fromAttribute('bLuE')).to.equal('blue');
        sinon.assert.notCalled(warnStub);
      });

      test('should return default and warn for non-matching string', () => {
        expect(converter.fromAttribute('yellow')).to.equal('red');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "yellow" received.*Using default value "red"/));
        warnStub.resetHistory();

        expect(converter.fromAttribute('')).to.equal('red');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "" received.*Using default value "red"/));
      });

      test('should return default (no warn) for null attribute', () => {
        expect(converter.fromAttribute(null)).to.equal('red');
        sinon.assert.notCalled(warnStub); // Correct: null attribute uses default silently
      });
    });

    suite('toAttribute (map lookup)', () => {
      test('should return the correct string representation', () => {
        expect(converter.toAttribute('red')).to.equal('red');
        expect(converter.toAttribute('blue')).to.equal('blue');
        sinon.assert.notCalled(warnStub);
      });

      test('should return null and warn for non-canonical values', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(converter.toAttribute('yellow' as any)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid enum value "yellow" provided to toAttribute.*Returning null/));
        warnStub.resetHistory();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(converter.toAttribute(null as any)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid enum value "null" provided to toAttribute.*Returning null/));
      });
    });
  }); // End Simple Strings Suite

  // --- Test Scenario: Mixed Case Strings & Collisions ---
  suite('with mixed-case string values and collision', () => {
    // 'UP' and 'up' map to the same lowercase 'up'. 'up' comes last.
    const directions = ['UP', 'down', 'Left', 'up'] as const;
    type Direction = (typeof directions)[number]; // 'UP' | 'down' | 'Left' | 'up'
    let converter: SafeReflectPropertyConverter<Direction>;

    // Check init warning specifically here
    test('Initialization check for collision warning', () => {
      enumToSafeConverter<Direction>(directions);
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Warning: Multiple values map to the same case-insensitive attribute string: up/));
    });

    setup(() => {
      // Create converter fresh, allow init warning check above
      converter = enumToSafeConverter<Direction>(directions); // Default: 'UP'
      warnStub.resetHistory(); // Reset for method tests
    });

    suite('setProperty (strict check)', () => {
      test('should return value if it matches canonical exactly', () => {
        expect(converter.setProperty('UP')).to.equal('UP');
        expect(converter.setProperty('down')).to.equal('down');
        expect(converter.setProperty('Left')).to.equal('Left');
        expect(converter.setProperty('up')).to.equal('up');
        sinon.assert.notCalled(warnStub);
      });

      test('should return default and warn for case mismatch with canonical or invalid', () => {
        expect(converter.setProperty('Down')).to.equal('UP'); // Default 'UP'
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "Down".*Using default value "UP"/));
        warnStub.resetHistory();

        expect(converter.setProperty('LEFT')).to.equal('UP');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "LEFT".*Using default value "UP"/));
        warnStub.resetHistory();

        expect(converter.setProperty('uP')).to.equal('UP'); // Neither 'UP' nor 'up'
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "uP".*Using default value "UP"/));
        warnStub.resetHistory();

        expect(converter.setProperty('right')).to.equal('UP');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "right".*Using default value "UP"/));
      });
    });

    suite('fromAttribute (case-insensitive map lookup)', () => {
      test('should return correct canonical value for unique lowercase', () => {
        expect(converter.fromAttribute('DOWN')).to.equal('down');
        expect(converter.fromAttribute('down')).to.equal('down');
        expect(converter.fromAttribute('Left')).to.equal('Left');
        expect(converter.fromAttribute('left')).to.equal('Left');
        sinon.assert.notCalled(warnStub);
      });

      test('should return the *last* canonical value for colliding lowercase key', () => {
        // Both 'UP' and 'up' map to lowercase 'up'. 'up' was processed last.
        expect(converter.fromAttribute('up')).to.equal('up');
        expect(converter.fromAttribute('UP')).to.equal('up');
        expect(converter.fromAttribute('uP')).to.equal('up');
        sinon.assert.notCalled(warnStub);
      });

      test('should return default and warn for non-matching string', () => {
        expect(converter.fromAttribute('right')).to.equal('UP');
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "right" received.*Using default value "UP"/));
      });

      test('should return default (no warn) for null attribute', () => {
        expect(converter.fromAttribute(null)).to.equal('UP');
        sinon.assert.notCalled(warnStub);
      });
    });

    suite('toAttribute (map lookup)', () => {
      test('should return the correct string representation for each canonical value', () => {
        expect(converter.toAttribute('UP')).to.equal('UP');
        expect(converter.toAttribute('down')).to.equal('down');
        expect(converter.toAttribute('Left')).to.equal('Left');
        expect(converter.toAttribute('up')).to.equal('up');
        sinon.assert.notCalled(warnStub);
      });

      test('should return null and warn for non-canonical values', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(converter.toAttribute('right' as any)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid enum value "right" provided to toAttribute.*Returning null/));
      });
    });
  }); // End Mixed Case Suite

  // --- Test Scenario: Number Values ---
  suite('with number values', () => {
    const sizes = [0, 10, 20] as const;
    type Size = (typeof sizes)[number];
    let converter: SafeReflectPropertyConverter<Size>;

    setup(() => {
      converter = enumToSafeConverter<Size>(sizes); // Default: 0
      warnStub.resetHistory();
    });

    suite('setProperty (strict check)', () => {
      test('should return the value if it matches exactly', () => {
        expect(converter.setProperty(10)).to.equal(10);
        expect(converter.setProperty(0)).to.equal(0);
        sinon.assert.notCalled(warnStub);
      });

      test('should return default and warn for non-matching number or different type', () => {
        expect(converter.setProperty(15)).to.equal(0); // Default 0
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "15".*Using default value "0"/));
        warnStub.resetHistory();

        expect(converter.setProperty('10')).to.equal(0); // String '10' != number 10
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "10".*Using default value "0"/));
        warnStub.resetHistory();

        expect(converter.setProperty(null)).to.equal(0);
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "null".*Using default value "0"/));
      });
    });

    suite('fromAttribute (map lookup based on String(value))', () => {
      test('should return number if attribute string matches String(number)', () => {
        expect(converter.fromAttribute('0')).to.equal(0);
        expect(converter.fromAttribute('10')).to.equal(10);
        expect(converter.fromAttribute('20')).to.equal(20);
        sinon.assert.notCalled(warnStub);
      });

      test('should return default and warn for non-matching string', () => {
        expect(converter.fromAttribute('0.0')).to.equal(0); // Not "0"
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "0\.0" received.*Using default value "0"/));
        warnStub.resetHistory();

        expect(converter.fromAttribute('ten')).to.equal(0);
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "ten" received.*Using default value "0"/));
        warnStub.resetHistory();

        expect(converter.fromAttribute('')).to.equal(0);
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "" received.*Using default value "0"/));
      });

      test('should return default (no warn) for null attribute', () => {
        expect(converter.fromAttribute(null)).to.equal(0);
        sinon.assert.notCalled(warnStub);
      });
    });

    suite('toAttribute (map lookup)', () => {
      test('should return the correct string representation', () => {
        expect(converter.toAttribute(0)).to.equal('0');
        expect(converter.toAttribute(10)).to.equal('10');
        expect(converter.toAttribute(20)).to.equal('20');
        sinon.assert.notCalled(warnStub);
      });

      test('should return null and warn for non-canonical values', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(converter.toAttribute(15 as any)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid enum value "15" provided to toAttribute.*Returning null/));
      });
    });
  }); // End Number Suite

  // --- Test Scenario: Object Values (Limited Support) ---
  suite('with object values (limited auto support)', () => {
    const objA = Object.create({
      toString() {
        return 'objA';
      },
    });
    objA.id = 'a';
    const objB = {id: 'b'};
    // Add a colliding object representation
    const objC = {id: 'b', extra: true}; // String(objC) might be same as String(objB)
    const values = [objB, objA, objC] as const;
    type Obj = (typeof values)[number];
    let converter: SafeReflectPropertyConverter<Obj>;

    // Check init warning specifically here
    test('Initialization check for object string collision', () => {
      if (String(objB) === String(objC)) {
        debugger;
        enumToSafeConverter<Obj>(values);
        sinon.assert.calledWithExactly(warnStub, sinon.match(/Warning: Multiple values map to the same case-insensitive attribute string: \[object object\]/)); // Or specific string if toString is overridden
      } else {
        // If they don't collide, no warning is expected
        enumToSafeConverter<Obj>(values);
        sinon.assert.notCalled(warnStub);
      }
    });

    setup(() => {
      converter = enumToSafeConverter<Obj>(values); // Default: objB
      warnStub.resetHistory();
    });

    suite('setProperty (identity check)', () => {
      test('should return the object if same identity', () => {
        expect(converter.setProperty(objA)).to.equal(objA);
        expect(converter.setProperty(objB)).to.equal(objB);
        expect(converter.setProperty(objC)).to.equal(objC);
        sinon.assert.notCalled(warnStub);
      });

      test('should return default and warn for different identity or type', () => {
        const otherA = {id: 'a'}; // Different identity
        expect(converter.setProperty(otherA)).to.equal(objB); // Default objB
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "\[object Object\]".*Using default value "\[object Object\]"/));
        warnStub.resetHistory();

        expect(converter.setProperty('a')).to.equal(objB);
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "a".*Using default value "\[object Object\]"/));
        warnStub.resetHistory();

        expect(converter.setProperty(null)).to.equal(objB);
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "null".*Using default value "\[object Object\]"/));
      });
    });

    suite('fromAttribute (map lookup based on String(value))', () => {
      test('should return default or last colliding object based on String(value)', () => {
        const stringA = String(objA);
        const stringB = String(objB);
        const stringC = String(objC);

        // Check A
        expect(converter.fromAttribute(stringA)).to.equal(objA); // Assuming stringA is unique
        sinon.assert.notCalled(warnStub); // Assuming stringA existed
        warnStub.resetHistory();

        // Check B/C collision
        if (stringB === stringC) {
          // objC was last in the array, so it wins the map entry for the colliding string
          expect(converter.fromAttribute(stringB)).to.equal(objC);
          sinon.assert.notCalled(warnStub);
        } else {
          // No collision, B should work
          expect(converter.fromAttribute(stringB)).to.equal(objB);
          sinon.assert.notCalled(warnStub);
          warnStub.resetHistory();
          // And C should work
          expect(converter.fromAttribute(stringC)).to.equal(objC);
          sinon.assert.notCalled(warnStub);
        }
        warnStub.resetHistory();

        // Check others
        expect(converter.fromAttribute('objA')).to.equal(objA); // objA
        sinon.assert.notCalled(warnStub);
        warnStub.resetHistory();

        expect(converter.fromAttribute('{"id":"a"}')).to.equal(objB); // Default
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "{"id":"a"}" received.*Using default value "\[object Object\]"/));
        warnStub.resetHistory();

        expect(converter.fromAttribute(null)).to.equal(objB); // Default
        sinon.assert.notCalled(warnStub); // Null attribute uses default silently
      });
    });

    suite('toAttribute (map lookup)', () => {
      test('should return String(value) for canonical objects', () => {
        expect(converter.toAttribute(objA)).to.equal(String(objA));
        expect(converter.toAttribute(objB)).to.equal(String(objB));
        expect(converter.toAttribute(objC)).to.equal(String(objC));
        sinon.assert.notCalled(warnStub);
      });

      test('should return null and warn for non-canonical values', () => {
        const otherA = {id: 'a'};
        expect(converter.toAttribute(otherA as any)).to.be.null;
        sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid enum value "\[object Object\]" provided to toAttribute.*Returning null/));
      });
    });
  }); // End Object Suite

  // --- Test Scenario: Custom Default Value ---
  suite('with custom defaultValue', () => {
    const modes = ['read', 'write', 'admin'] as const;
    type Mode = (typeof modes)[number];
    let converter: SafeReflectPropertyConverter<Mode>;

    setup(() => {
      converter = enumToSafeConverter<Mode>(modes, {defaultValue: 'write'});
      warnStub.resetHistory();
    });

    test('should use custom default for setProperty failures and warn', () => {
      expect(converter.setProperty('READ')).to.equal('write'); // Case mismatch -> default
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "READ".*Using default value "write"/));
      warnStub.resetHistory();

      expect(converter.setProperty('delete')).to.equal('write'); // Invalid -> default
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "delete".*Using default value "write"/));
      warnStub.resetHistory();

      expect(converter.setProperty(null)).to.equal('write'); // Invalid -> default
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid value set via property: received "null".*Using default value "write"/));
    });

    test('should use custom default for fromAttribute failures', () => {
      expect(converter.fromAttribute('READ')).to.equal('read'); // Case ok -> 'read'
      sinon.assert.notCalled(warnStub);
      warnStub.resetHistory();

      expect(converter.fromAttribute('Admin')).to.equal('admin'); // Case ok -> 'admin'
      sinon.assert.notCalled(warnStub);
      warnStub.resetHistory();

      expect(converter.fromAttribute('delete')).to.equal('write'); // Invalid -> custom default 'write'
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "delete" received.*Using default value "write"/));
      warnStub.resetHistory();

      expect(converter.fromAttribute('')).to.equal('write'); // Invalid -> custom default 'write'
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid attribute value "" received.*Using default value "write"/));
    });

    test('should use custom default for fromAttribute null (no warn)', () => {
      expect(converter.fromAttribute(null)).to.equal('write'); // Null -> custom default 'write'
      sinon.assert.notCalled(warnStub);
    });

    test('toAttribute should convert custom default correctly', () => {
      // 'write' is a valid canonical value
      expect(converter.toAttribute('write')).to.equal('write');
      sinon.assert.notCalled(warnStub);
    });

    test('toAttribute should handle invalid input even if it matches custom default type', () => {
      // Ensure that even if a value somehow resembled the default but wasn't
      // part of the original 'values' array, toAttribute handles it correctly.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(converter.toAttribute('write_invalid' as any)).to.be.null;
      sinon.assert.calledOnceWithExactly(warnStub, sinon.match(/Invalid enum value "write_invalid" provided to toAttribute.*Returning null/));
    });
  }); // End Custom Default Suite
}); // End Main Suite
// --- END OF FILE enum-to-safe-converter.test.ts ---
