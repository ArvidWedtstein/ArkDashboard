import { render, waitFor, screen } from '@redwoodjs/testing/web'

import {
  formatEnum,
  jsonTruncate,
  truncate,
  timeTag,
  jsonDisplay,
  checkboxInputTag,
  dynamicSort,
  combineBySummingKeys,
  mergeRecipe,
  isObject,
  merge,
  capitalize,
  getWeekDates,
  isDate,
  calcItemCost,
  random,
  wordNumberRegex,
  getDateDiff,
  groupBy,
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

describe('jsonTruncate', () => {
  it('truncates large json structures', () => {
    expect(
      jsonTruncate({
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
        kittens: 'kittens meow',
        bazinga: 'Sheldon',
        nested: {
          foobar: 'I have no imagination',
          two: 'Second nested item',
        },
        five: 5,
        bool: false,
      })
    ).toMatch(/.+\n.+\w\.\.\.$/s)
  })
})

describe('timeTag', () => {
  it('renders a date', async () => {
    render(<div>{timeTag(new Date('1970-08-20').toUTCString())}</div>)

    await waitFor(() => screen.getByText(/1970.*00:00:00/))
  })

  it('can take an empty input string', async () => {
    expect(timeTag('')).toEqual('')
  })
})

describe('jsonDisplay', () => {
  it('produces the correct output', () => {
    expect(
      jsonDisplay({
        title: 'TOML Example (but in JSON)',
        database: {
          data: [['delta', 'phi'], [3.14]],
          enabled: true,
          ports: [8000, 8001, 8002],
          temp_targets: {
            case: 72.0,
            cpu: 79.5,
          },
        },
        owner: {
          dob: '1979-05-27T07:32:00-08:00',
          name: 'Tom Preston-Werner',
        },
        servers: {
          alpha: {
            ip: '10.0.0.1',
            role: 'frontend',
          },
          beta: {
            ip: '10.0.0.2',
            role: 'backend',
          },
        },
      })
    ).toMatchInlineSnapshot(`
      <pre>
        <code>
          {
        "title": "TOML Example (but in JSON)",
        "database": {
          "data": [
            [
              "delta",
              "phi"
            ],
            [
              3.14
            ]
          ],
          "enabled": true,
          "ports": [
            8000,
            8001,
            8002
          ],
          "temp_targets": {
            "case": 72,
            "cpu": 79.5
          }
        },
        "owner": {
          "dob": "1979-05-27T07:32:00-08:00",
          "name": "Tom Preston-Werner"
        },
        "servers": {
          "alpha": {
            "ip": "10.0.0.1",
            "role": "frontend"
          },
          "beta": {
            "ip": "10.0.0.2",
            "role": "backend"
          }
        }
      }
        </code>
      </pre>
    `)
  })
})

describe('checkboxInputTag', () => {
  it('can be checked', () => {
    render(checkboxInputTag(true))
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('can be unchecked', () => {
    render(checkboxInputTag(false))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('is disabled when checked', () => {
    render(checkboxInputTag(true))
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('is disabled when unchecked', () => {
    render(checkboxInputTag(false))
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})


describe('dynamicSort', () => {
  it('sorts objects by property', () => {
    const objects = [
      { name: 'John', age: 30 },
      { name: 'Mary', age: 20 },
      { name: 'Peter', age: 10 },
    ]

    expect(objects.sort(dynamicSort('name'))).toEqual([
      { name: 'John', age: 30 },
      { name: 'Mary', age: 20 },
      { name: 'Peter', age: 10 },
    ])

    expect(objects.sort(dynamicSort('age'))).toEqual([
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

    expect(combineBySummingKeys(objects, 'age')).toEqual({
      name: 'John, Mary, Peter',
      age: 60,
    })
  })
})

// describe('mergeRecipe', () => {
//   it('merges ark recipies', () => {
//     const recipe = {
//       name: 'Test Recipe',
//       description: 'Test Description',
//       ingredients: [
//         {
//           name: 'Test Ingredient',
//           amount: 1,
//           unit: 'Test Unit',
//         },
//       ],
//       steps: [
//         {
//           name: 'Test Step',
//           description: 'Test Description',
//         },
//       ],
//     }

//     expect(mergeRecipe(recipe, recipe)).toEqual({
//       name: 'Test Recipe',
//       description: 'Test Description',
//       ingredients: [
//         {
//           name: 'Test Ingredient',
//           amount: 2,
//           unit: 'Test Unit',
//         },
//       ],
//       steps: [
//         {
//           name: 'Test Step',
//           description: 'Test Description',
//         },
//         {
//           name: 'Test Step',
//           description: 'Test Description',
//         },
//       ],
//     })
//   })
// })

describe('isObject', () => {
  it('returns true for objects', () => {
    expect(isObject({})).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isObject([])).toBe(false)
  })

  it('returns false for strings', () => {
    expect(isObject('')).toBe(false)
  })

  it('returns false for numbers', () => {
    expect(isObject(0)).toBe(false)
  })

  it('returns false for booleans', () => {
    expect(isObject(true)).toBe(false)
  })
})

describe('merge', () => {
  it('merges objects', () => {
    expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('merges objects recursively', () => {
    expect(merge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } })
  })

  it('merges objects with arrays', () => {
    expect(merge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [1, 2, 3, 4] })
  })
})

describe('capitalize', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('does not capitalize the first letter of a string if it is already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })
})

describe('getWeekDates', () => {
  it('returns an array of the start and end date of the current week', () => {
    const dates = getWeekDates()

    expect(dates).toHaveLength(2)
    expect(dates[0]).toBeInstanceOf(Date)
    expect(dates[1]).toBeInstanceOf(Date)
  })
})

describe('isDate', () => {
  it('returns true for dates', () => {
    expect(isDate(`${new Date()}`)).toBe(true)
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

describe('calcItemCost', () => {
  it('calculates the cost of an item', () => {
    expect(calcItemCost(10, 2)).toBe(20)
  })
})

describe('random', () => {
  it('returns a random number', () => {
    expect(random(0, 10)).toBeGreaterThanOrEqual(0)
    expect(random(0, 10)).toBeLessThanOrEqual(10)
  })
})

describe('wordNumberRegex', () => {
  it('matches a word number', () => {
    expect(wordNumberRegex('one')).toBe(true)
  })

  it('does not match a non-word number', () => {
    expect(wordNumberRegex('1')).toBe(false)
  })
})

describe('getDateDiff', () => {
  it('returns the difference between two dates in days, hours, minutes and dateString', () => {
    expect(getDateDiff(new Date('2020-01-01'), new Date('2020-01-02'))).toBe({days: 1, hours: 0, minutes: 0, dateString: '1 day'})
  })
})

// describe('groupBy', () => {
//   it('groups an array by a key', () => {
//     const objects = [
//       { name: 'John', age: 30 },
//       { name: 'Mary', age: 20 },
//       { name: 'Peter', age: 10 },
//     ]

//     expect(groupBy(objects, 'age')).toEqual({
//       10: [{ name: 'Peter', age: 10 }],
//       20: [{ name: 'Mary', age: 20 }],
//       30: [{ name: 'John', age: 30 }],
//     })
//   })
// })