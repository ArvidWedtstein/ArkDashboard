import React from 'react'

import humanize from 'humanize-string'
import prices from "../../public/arkitems.json";

export const formatEnum = (values: string | string[] | null | undefined) => {
  let output = ''

  if (Array.isArray(values)) {
    const humanizedValues = values.map((value) => humanize(value))
    output = humanizedValues.join(', ')
  } else if (typeof values === 'string') {
    output = humanize(values)
  }

  return output
}

/**
 * @description Capitalize the first letter of each word in a string
 * @param sentence
 * @returns Capitalized string
 */
export const capitalizeSentence = (sentence: string) => {
  return sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

export const jsonDisplay = (obj: unknown) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  )
}

export const truncate = (value: string | number, maxlength: number = 150) => {
  let output = value?.toString() ?? ''

  if (output.length > maxlength) {
    output = output.substring(0, maxlength) + '...'
  }

  return output
}

export const jsonTruncate = (obj: unknown) => {
  return truncate(JSON.stringify(obj, null, 2))
}

export const timeTag = (dateTime?: string) => {
  let output: string | JSX.Element = ''

  if (dateTime) {
    output = (
      <time dateTime={dateTime} title={dateTime}>
        {new Date(dateTime).toLocaleString('en-US', {
          timeStyle: 'short',
          dateStyle: 'long',
        })}
      </time>
    )
  }

  return output
}

export const checkboxInputTag = (checked: boolean) => {
  return <input type="checkbox" checked={checked} disabled />
}

/**
 *
 * @param property string to sort by
 * @returns
 */
export const dynamicSort = (property: string) => {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};


/**
 *
 * @param objects
 * @returns combined object where numberic values are summed
 */
export const combineBySummingKeys = (...objects) => {
  const mergedObj = {};
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      mergedObj[key] = (mergedObj[key] || 0) + obj[key];
    });
  });
  return mergedObj;
};

/**
 * @description For ark item objects only. Combines the recipe arrays of multiple objects into one object
 * @param objects
 * @returns
 */
export const mergeRecipe = (...objects): Object => {
  const mergedObj = {};

  objects.forEach((obj) => {
    obj.recipe.forEach((res) => {
      mergedObj[res.itemId] =
        (mergedObj[res.itemId] || 0) + res["count"] * obj.amount;
    });
  });

  return mergedObj;
};

/**
 * @name isObject
 * @param {any} value determines if value is an object
 * @returns {boolean} true if value is an object
 * @kind function
 */
export const isObject = (value) => {
  return (
    !!value &&
    typeof value === "object" &&
    typeof value.getMonth !== "function" &&
    !Array.isArray(value)
  );
};

/**
 * Checks if a value is a valid UUID
 * @param {string} value
 * @returns {boolean}
 */
export const isUUID = (value: string): boolean => {
  return (
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(
      value
    )
  );
};


/**
 *
 * @param {Array} sources
 * @example merge({a: 1}, {b: 2}, {b: 2}) // {a: 1, b: 4}
 * @returns merged object
 * @mixes all input objects into one object
 * @since 0.1.0
 * @summary Merges all input objects into one object
 * @static true
 * @requires isObject function
 */
export const merge = (...sources) => {
  const [target, ...rest] = sources;

  for (const object of rest) {
    for (const key in object) {
      const targetValue = target[key];
      const sourceValue = object[key];
      const isMergable = isObject(targetValue) && isObject(sourceValue);
      target[key] = isMergable
        ? merge({}, targetValue, sourceValue)
        : sourceValue;
    }
  }

  return target;
};

export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * @description Returns the start and end date of the current week
 * @returns {Array} array of start and end dates of the current week
 */
export const getWeekDates = () => {
  let now = new Date();
  let dayOfWeek = now.getDay(); //0-6
  let numDay = now.getDate();

  let start = new Date(now); //copy
  start.setDate(numDay - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  let end = new Date(now); //copy
  end.setDate(numDay + (7 - dayOfWeek));
  end.setHours(0, 0, 0, 0);

  return [start, end];
};

// autogenerate JSdoc comment for isDate function
/**
 * @name isDate
 * @param {string} date
 * @returns {boolean} true if date is in 2022-11-28T14:17:14.899Z format
 * @kind function
 * @since 0.1.0
 * @summary Checks if date is in 2022-11-28T14:17:14.899Z format
 * @static true
 * @requires regex test for  2022-11-28T14:17:14.899Z format
 * @example isDate("2022-11-28T14:17:14.899Z") // true
 * @example isDate("2022-11-28T14:17:14.899") // false
 * @example isDate("2022-11-28T14:17:14") // false
 * @example isDate("2022-11-28T14:17") // false
 * @example isDate("2022-11-28T14") // false
 * @example isDate("2022-11-28") // false
 * @example isDate("2022-11") // false
 * @example isDate("2022") // false
 */
export const isDate = (date: any): boolean => {
  // regex test for  2022-11-28T14:17:14.899Z format
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return regex.test(date);
};
/**
 * @description Calculates the cost of an ark item
 * @param {Number} amount
 * @param {String} item_id
 * @returns Object with prices
 */
export const calcItemCost = (amount: number, item_id) => {
  if (Number.isNaN(amount)) return console.error("Amount is NaN");
  if (!prices.items.find((e) => e.itemId === item_id))
    return console.error(
      "\x1b[31m%s\x1b[0m",
      `[ArkMatCalc Error]: ${item_id} not found in prices`
    );
  let price = {};
  prices.items.find((e) => e.itemId === item_id).recipe.forEach((item, i) => {
    console.log("itemId", item.itemId)
    let founditem = prices.items.find((e) => e.itemId === item.itemId)
    if (founditem.recipe.length > 0) {
      console.log('find', calcItemCost(item.count, founditem.itemId))
      price = combineBySummingKeys(calcItemCost(item.count, founditem.itemId), price);

    } else {
      price[`${item.itemId}`] = item.count * Number(amount);
    }
  });
  return price;
};


/**
 *
 * @param {number} min - minimum number
 * @param {number} max - maximum number
 * @returns a random number between min and max
 */
export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 *
 * @param {string} str string to match
 * @returns the matched numbers as words in the string¨
 * @example wordNumberRegex("I have two apples and 3 bananas") // ["two"]
 * @exports wordNumberRegex
 */

export const wordNumberRegex = (str: string) => {
  return str.match(
    /(?:f(?:ive|our)|s(?:even|ix)|t(?:hree|wo)|(?:ni|o)ne|eight)/gi
  );
};

/**
 * singularizes a word.
 * @param word
 * @returns
 * @example singularize("apples") // "apple"
 */
export const singularize = (word: string) => {
  const endings = {
    ves: 'fe',
    ies: 'y',
    i: 'us',
    zes: 'ze',
    ses: 's',
    es: 'e',
    s: ''
  };
  return word.replace(
    new RegExp(`(${Object.keys(endings).join('|')})$`),
    r => endings[r]
  );
}




export const getDateDiff = (date1: Date, date2: Date) => {
  const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
  return {
    days: Math.floor(diff / (1000 * 3600 * 24)),
    hours: Math.floor((diff / (1000 * 3600)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    dateString: `${Math.floor(diff / (1000 * 3600 * 24))} days, ${Math.floor(
      (diff / (1000 * 3600)) % 24
    )} hours, ${Math.floor((diff / 1000 / 60) % 60)} minutes`,
  };
};

/**
 * @description removes duplicates from an array
 * @param arr
 * @returns
 */
export const remDupicates = (arr: Array<any>): Array<any> => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

/**
 *
 * @param xs
 * @param key
 * @returns grouped object
 */
export const groupBy = (xs: Array<any>, key: string) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
/**
 *
 * @param array
 * @param callback
 * @returns grouped array of objects
 * @example
 * data = [
 * { created_at: '2021-09-01T14:17:14.899Z', profile_id: 1 },
 * { created_at: '2021-09-01T14:17:14.899Z', profile_id: 2 },
 * { created_at: '2021-09-01T14:17:14.899Z', profile_id: 3 }
 * ]
 * groupByMultiple(data, function (item) {
    item.created_at = new Date(item.created_at).setSeconds(0, 0);
    return [item.created_at, item.profile_id];
  })
 */
export const groupByMultiple = (array: Array<any>, callback: (item) => void) => {
  let groups = {};
  array.forEach(function (o) {
    var group = JSON.stringify(callback(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
}

/**
 * @description debounce function for search fields
 * @param func
 * @param wait
 * @returns
 * @example
 *  const handleSearch = debounce((e) => setSearch(e.target.value))
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns number between min and max
 * @example
 * clamp(10, 0, 5) // 5
 */
export const clamp = ((value: number, min: number | undefined, max: number | undefined) => {
  return Math.min(Math.max(value, min ?? Number.MIN_VALUE), max ?? Number.MAX_VALUE);
});


type Colors = 'red' | 'purple' | 'blue' | 'green' | 'slate' | 'stone' | 'gray';
type Luminance = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type BgColor = `bg-${Colors}-${Luminance}`;
export type TextColor = `text-${Colors}-${Luminance}`;
export type FillColor = `fill-${Colors}-${Luminance}`;
export type StrokeColor = `stroke-${Colors}-${Luminance}`;
export type Color = `${Colors}-${Luminance}`;

type Distance = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Breakpoints = 'xs:' | 'sm:' | 'md:' | 'lg:' | 'xl:' | '';
type Space = `${Breakpoints}space-${'x' | 'y'}-${Distance}`;
type Padding = `${Breakpoints}p-${Distance}`;
