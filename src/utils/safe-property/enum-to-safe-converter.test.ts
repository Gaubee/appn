// values-to-enum-converter.test.ts
import {expect} from 'chai';
// Adjust the import path as necessary
import {enumToSafeConverter} from './enum-to-safe-converter';

suite('valuesToEnumConverter (Map Optimized)', () => {
  // --- Test Initialization and Error Conditions ---
  test('Initialization and Error Handling', () => {
    test('should throw error if values array is empty', () => {
      expect(() => enumToSafeConverter([] as any)).to.throw('valuesToEnumConverter requires a non-empty array of possible values.');
    });

    test('should throw error if explicit defaultValue is not in values (string)', () => {
      const values = ['a', 'b'] as const;
      expect(() => enumToSafeConverter(values, {defaultValue: 'c' as any})).to.throw('The effective defaultValue (c) is not present in the provided values array.');
    });

    test('should throw error if explicit defaultValue is not in values (number)', () => {
      const values = [1, 2] as const;
      expect(() => enumToSafeConverter(values, {defaultValue: 3 as any})).to.throw('The effective defaultValue (3) is not present in the provided values array.');
    });

    test('should throw error if explicit defaultValue is not in values (object identity)', () => {
      const objA = {id: 1};
      const objB = {id: 2};
      const values = [objA, objB] as const;
      const differentObjB = {id: 2}; // Different identity
      expect(() => enumToSafeConverter(values, {defaultValue: differentObjB})).to.throw('The effective defaultValue ({"id":2}) is not present in the provided values array.');
    });

    // Note: Testing console warnings is harder. We test the *result* of collisions below.
  });

  // --- Test Scenario: Simple String Values ---
  test('with simple string values (all lowercase)', () => {
    const colors = ['red', 'green', 'blue'] as const;
    type Color = (typeof colors)[number];
    const converter = enumToSafeConverter<Color>(colors); // Default: 'red'

    test('setProperty (strict check)', () => {
      test('should return the value if it matches exactly', () => {
        expect(converter.setProperty('green')).to.equal('green');
        expect(converter.setProperty('red')).to.equal('red');
      });

      test('should return default for case mismatch or invalid string', () => {
        expect(converter.setProperty('RED')).to.equal('red'); // Default 'red'
        expect(converter.setProperty('yellow')).to.equal('red');
      });

      test('should return default for non-string types', () => {
        expect(converter.setProperty(1)).to.equal('red');
        expect(converter.setProperty(null)).to.equal('red');
        expect(converter.setProperty(undefined)).to.equal('red');
      });
    });

    test('fromAttribute (case-insensitive map lookup)', () => {
      test('should return canonical value for exact match', () => {
        expect(converter.fromAttribute('green')).to.equal('green');
      });

      test('should return canonical value for case-insensitive match', () => {
        expect(converter.fromAttribute('RED')).to.equal('red');
        expect(converter.fromAttribute('bLuE')).to.equal('blue');
      });

      test('should return default for non-matching string or null', () => {
        expect(converter.fromAttribute('yellow')).to.equal('red');
        expect(converter.fromAttribute('')).to.equal('red');
        expect(converter.fromAttribute(null)).to.equal('red');
      });
    });

    test('toAttribute (map lookup)', () => {
      test('should return the correct string representation', () => {
        expect(converter.toAttribute('red')).to.equal('red');
        expect(converter.toAttribute('blue')).to.equal('blue');
      });

      test('should return null for non-canonical values', () => {
        // This shouldn't happen with strong typing, but test if forced
        expect(converter.toAttribute('yellow' as any)).to.be.null;
        expect(converter.toAttribute(null as any)).to.be.null;
      });
    });
  });

  // --- Test Scenario: Mixed Case Strings & Collisions ---
  test('with mixed-case string values and collision', () => {
    // 'UP' and 'up' map to the same lowercase 'up'. 'up' comes last.
    const directions = ['UP', 'down', 'Left', 'up'] as const;
    type Direction = (typeof directions)[number]; // 'UP' | 'down' | 'Left' | 'up'
    const converter = enumToSafeConverter<Direction>(directions); // Default: 'UP'

    test('setProperty (strict check)', () => {
      test('should return value if it matches canonical exactly', () => {
        expect(converter.setProperty('UP')).to.equal('UP');
        expect(converter.setProperty('down')).to.equal('down');
        expect(converter.setProperty('Left')).to.equal('Left');
        expect(converter.setProperty('up')).to.equal('up'); // Lowercase 'up' is also canonical
      });

      test('should return default for case mismatch with canonical or invalid', () => {
        expect(converter.setProperty('Down')).to.equal('UP'); // Default 'UP'
        expect(converter.setProperty('LEFT')).to.equal('UP');
        expect(converter.setProperty('uP')).to.equal('UP'); // Neither 'UP' nor 'up'
        expect(converter.setProperty('right')).to.equal('UP');
      });
    });

    test('fromAttribute (case-insensitive map lookup)', () => {
      test('should return correct canonical value for unique lowercase', () => {
        expect(converter.fromAttribute('DOWN')).to.equal('down');
        expect(converter.fromAttribute('down')).to.equal('down');
        expect(converter.fromAttribute('Left')).to.equal('Left');
        expect(converter.fromAttribute('left')).to.equal('Left');
      });

      test('should return the *last* canonical value for colliding lowercase key', () => {
        // Both 'UP' and 'up' map to lowercase 'up'. 'up' was processed last.
        expect(converter.fromAttribute('up')).to.equal('up');
        expect(converter.fromAttribute('UP')).to.equal('up');
        expect(converter.fromAttribute('uP')).to.equal('up');
      });

      test('should return default for non-matching string or null', () => {
        expect(converter.fromAttribute('right')).to.equal('UP');
        expect(converter.fromAttribute(null)).to.equal('UP');
      });
    });

    test('toAttribute (map lookup)', () => {
      test('should return the correct string representation for each canonical value', () => {
        expect(converter.toAttribute('UP')).to.equal('UP');
        expect(converter.toAttribute('down')).to.equal('down');
        expect(converter.toAttribute('Left')).to.equal('Left');
        expect(converter.toAttribute('up')).to.equal('up'); // Returns the specific canonical value string
      });

      test('should return null for non-canonical values', () => {
        expect(converter.toAttribute('right' as any)).to.be.null;
      });
    });
  });

  // --- Test Scenario: Number Values ---
  test('with number values', () => {
    const sizes = [0, 10, 20] as const;
    type Size = (typeof sizes)[number];
    const converter = enumToSafeConverter<Size>(sizes); // Default: 0

    test('setProperty (strict check)', () => {
      test('should return the value if it matches exactly', () => {
        expect(converter.setProperty(10)).to.equal(10);
        expect(converter.setProperty(0)).to.equal(0);
      });

      test('should return default for non-matching number or different type', () => {
        expect(converter.setProperty(15)).to.equal(0); // Default 0
        expect(converter.setProperty('10')).to.equal(0); // String '10' != number 10
        expect(converter.setProperty(null)).to.equal(0);
      });
    });

    test('fromAttribute (map lookup based on String(value))', () => {
      test('should return number if attribute string matches String(number)', () => {
        expect(converter.fromAttribute('0')).to.equal(0);
        expect(converter.fromAttribute('10')).to.equal(10);
        expect(converter.fromAttribute('20')).to.equal(20);
      });

      test('should return default for non-matching string or null', () => {
        expect(converter.fromAttribute('0.0')).to.equal(0); // Not "0"
        expect(converter.fromAttribute('ten')).to.equal(0);
        expect(converter.fromAttribute('')).to.equal(0);
        expect(converter.fromAttribute(null)).to.equal(0);
      });
    });

    test('toAttribute (map lookup)', () => {
      test('should return the correct string representation', () => {
        expect(converter.toAttribute(0)).to.equal('0');
        expect(converter.toAttribute(10)).to.equal('10');
        expect(converter.toAttribute(20)).to.equal('20');
      });

      test('should return null for non-canonical values', () => {
        expect(converter.toAttribute(15 as any)).to.be.null;
      });
    });
  });

  // --- Test Scenario: Object Values (Limited Support) ---
  test('with object values (limited auto support)', () => {
    const objA = {id: 'a'};
    const objB = {id: 'b'};
    const values = [objA, objB] as const;
    type Obj = (typeof values)[number];
    const converter = enumToSafeConverter<Obj>(values); // Default: objA

    test('setProperty (identity check)', () => {
      test('should return the object if same identity', () => {
        expect(converter.setProperty(objA)).to.equal(objA);
        expect(converter.setProperty(objB)).to.equal(objB);
      });
      test('should return default for different identity or type', () => {
        const otherA = {id: 'a'}; // Different identity
        expect(converter.setProperty(otherA)).to.equal(objA); // Default objA
        expect(converter.setProperty('a')).to.equal(objA);
        expect(converter.setProperty(null)).to.equal(objA);
      });
    });

    test('fromAttribute (map lookup based on String(value))', () => {
      // String(obj) is typically '[object Object]' which is unreliable
      test('should generally return default unless attribute matches String(value)', () => {
        const stringA = String(objA); // e.g., '[object Object]'
        const stringB = String(objB); // e.g., '[object Object]'
        // If they stringify the same, the last one ('objB') wins the map entry
        const expectedWinner = stringA === stringB ? objB : objA;

        expect(converter.fromAttribute(stringA)).to.equal(expectedWinner);
        if (stringA !== stringB) {
          expect(converter.fromAttribute(stringB)).to.equal(objB);
        }

        // Other strings won't match
        expect(converter.fromAttribute('objA')).to.equal(objA); // Default
        expect(converter.fromAttribute('{"id":"a"}')).to.equal(objA); // Default
        expect(converter.fromAttribute(null)).to.equal(objA); // Default
      });
    });

    test('toAttribute (map lookup)', () => {
      test('should return String(value) for canonical objects', () => {
        // Uses the pre-calculated String(value) stored in valueToAttributeMap
        expect(converter.toAttribute(objA)).to.equal(String(objA));
        expect(converter.toAttribute(objB)).to.equal(String(objB));
      });
      test('should return null for non-canonical values', () => {
        const otherA = {id: 'a'};
        expect(converter.toAttribute(otherA as any)).to.be.null;
      });
    });
  });

  // --- Test Scenario: Custom Default Value ---
  test('with custom defaultValue', () => {
    const modes = ['read', 'write', 'admin'] as const;
    type Mode = (typeof modes)[number];
    const converter = enumToSafeConverter<Mode>(modes, {defaultValue: 'write'});

    test('should use custom default for setProperty failures', () => {
      expect(converter.setProperty('READ')).to.equal('write'); // Case mismatch
      expect(converter.setProperty('delete')).to.equal('write'); // Invalid
      expect(converter.setProperty(null)).to.equal('write');
    });

    test('should use custom default for fromAttribute failures', () => {
      expect(converter.fromAttribute('READ')).to.equal('read'); // Case ok
      expect(converter.fromAttribute('Admin')).to.equal('admin'); // Case ok
      expect(converter.fromAttribute('delete')).to.equal('write'); // Invalid -> custom default
      expect(converter.fromAttribute('')).to.equal('write'); // Invalid -> custom default
    });

    test('should use custom default for fromAttribute null', () => {
      expect(converter.fromAttribute(null)).to.equal('write'); // Null -> custom default
    });

    test('toAttribute should convert custom default correctly', () => {
      const failedSet = converter.setProperty('invalid'); // This is 'write'
      expect(converter.toAttribute(failedSet)).to.equal('write');
    });
  });
});
