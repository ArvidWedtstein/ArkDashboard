import { render, waitFor, screen } from '@redwoodjs/testing/web'

import {
  formatEnum,
  truncate,
  timeTag,
  dynamicSort,
  combineBySummingKeys,
  isDate,
  getDateDiff,
  groupBy,
  RgbToHex,
  RgbToHsl,
  HexToHsl,
  HexToRgb,
  HslToHex,
} from './formatters'

// https://dev.to/jbranchaud/test-timing-based-js-functions-with-jest-5be
// test with timers

describe('formatEnum', () => {
  it('handles nullish values', () => {
    expect(formatEnum(null)).toEqual('')
    expect(formatEnum('')).toEqual('')
    expect(formatEnum(undefined)).toEqual('')
  })

  it('formats a list of values', () => {
    expect(
      formatEnum(['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'VIOLET'])
    ).toEqual('Red, Orange, Yellow, Green, Blue, Violet')
  })

  it('formats a single value', () => {
    expect(formatEnum('DARK_BLUE')).toEqual('Dark blue')
  })

  it('returns an empty string for values of the wrong type (for JS projects)', () => {
    // @ts-expect-error - Testing JS scenario
    expect(formatEnum(5)).toEqual('')
  })
})


describe('truncate', () => {
  it('truncates really long strings', () => {
    expect(truncate('na '.repeat(1000) + 'batman').length).toBeLessThan(1000)
    expect(truncate('na '.repeat(1000) + 'batman')).not.toMatch(/batman/)
  })

  it('does not modify short strings', () => {
    expect(truncate('Short strinG')).toEqual('Short strinG')
  })

  it('adds ... to the end of truncated strings', () => {
    expect(truncate('repeat'.repeat(1000))).toMatch(/\w\.\.\.$/)
  })

  it('accepts numbers', () => {
    expect(truncate(123)).toEqual('123')
    expect(truncate(0)).toEqual('0')
    expect(truncate(0o000)).toEqual('0')
  })

  it('handles arguments of invalid type', () => {
    // @ts-expect-error - Testing JS scenario
    expect(truncate(false)).toEqual('false')

    expect(truncate(undefined)).toEqual('')
    expect(truncate(null)).toEqual('')
  })
})


describe('timeTag', () => {
  it('should return an empty string if dateTime is not provided', () => {
    const result = timeTag();
    expect(result).toBe('');
  });


  it('can take a date string', async () => {
    expect(timeTag('2021-01-01T00:00:00.000Z')).toMatchInlineSnapshot(`
      <time
        dateTime="January 1, 2021 at 1:00 AM"
        title="January 1, 2021 at 1:00 AM"
      >
      January 1, 2021 at 1:00 AM
      </time>
    `)
  })

  it('should return a formatted time tag element if dateTime is provided', () => {
    const dateTime = '2023-05-31T12:34:56';
    const result = timeTag(dateTime);
    expect(result).toEqual(expect.any(Object)); // Verifying it's a React element
  });
})

describe('dynamicSort', () => {
  it('sorts objects by property', () => {
    const objects = [
      { name: 'John', age: 30 },
      { name: 'Mary', age: 20 },
      { name: 'Peter', age: 10 },
    ]

    expect(dynamicSort(objects, 'name', false)).toEqual([
      { name: 'John', age: 30 },
      { name: 'Mary', age: 20 },
      { name: 'Peter', age: 10 },
    ])

    expect(dynamicSort(objects, 'age', true)).toEqual([
      { name: 'Peter', age: 10 },
      { name: 'Mary', age: 20 },
      { name: 'John', age: 30 },
    ])
  })
})

describe('combineBySummingKeys', () => {
  it('combines objects by summing keys', () => {
    const objects = [
      { name: 'John', age: 30 },
      { name: 'Mary', age: 20 },
      { name: 'Peter', age: 10 },
    ]

    expect(combineBySummingKeys(...objects)).toEqual({
      name: 'JohnMaryPeter',
      age: 60,
    })
  })
})

describe('isDate', () => {
  it('returns true for dates', () => {
    expect(isDate(new Date())).toBe(true)
  })

  it('returns false for strings', () => {
    expect(isDate('')).toBe(false)
  })

  it('returns false for numbers', () => {
    expect(isDate('0')).toBe(false)
  })

  it('returns false for booleans', () => {
    expect(isDate('true')).toBe(false)
  })
})


describe('getDateDiff', () => {
  it('returns the difference between two dates in days, hours, minutes and dateString', () => {
    expect(getDateDiff(new Date('2020-01-01'), new Date('2020-01-02'))).toBe({ dateString: '1 days, 0 hours, 0 minutes' })
  })
})

describe('groupBy', () => {
  it('groups an array by a key', () => {
    const objects = [
      { name: 'John', age: 30 },
      { name: 'Mary', age: 20 },
      { name: 'Peter', age: 10 },
      { name: 'Caitlin', age: 20 }
    ]

    expect(groupBy(objects, 'age')).toEqual({
      10: [{ name: 'Peter', age: 10 }],
      20: [{ name: 'Mary', age: 20 }, { name: 'Caitlin', age: 20 }],
      30: [{ name: 'John', age: 30 }],
    })
  })
})

describe('Color Conversion Functions', () => {
  describe('rgbToHex', () => {
    test('converts RGB to Hex', () => {
      expect(RgbToHex('rgb(255, 0, 0)')).toBe('#ff0000');
    });

    // Add more test cases as needed
  });

  describe('rgbToHsl', () => {
    test('converts RGB to HSL', () => {
      expect(RgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
    });

    // Add more test cases as needed
  });

  describe('hexToHsl', () => {
    test('converts Hex to HSL', () => {
      expect(HexToHsl('#ff0000')).toEqual([0, 100, 50]);
    });

    // Add more test cases as needed
  });

  describe('hexToRgb', () => {
    test('converts Hex to RGB', () => {
      expect(HexToRgb('#ff0000')).toBe('rgb(255, 0, 0)');
    });

    // Add more test cases as needed
  });

  describe('hslToHex', () => {
    test('converts HSL to Hex', () => {
      expect(HslToHex(0, 100, 50)).toBe('#ff0000');
    });

    // Add more test cases as needed
  });
});