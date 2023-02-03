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
 * chatgpt
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
 * Calculates the base materials required to produce the specified objects.
 *
 * @param {boolean} firstRecipeOnly - If set to true, only the first recipe will be considered and
 *                                     the function will return the direct materials.
 * @param {...Object} objects - The objects for which the base materials are to be calculated.
 * @param {string} objects.itemId - The unique identifier for the object.
 * @param {number} objects.amount - The number of objects required.
 *
 * @returns {Array<any>} An array of objects representing the base materials required.
 */
export const getBaseMaterials = (firstRecipeOnly: boolean = false, ...objects: Array<any>) => {
  let materials = [];

  /**
   * Recursive function to find the base materials required to produce an object.
   *
   * @param {number} itemId - The unique identifier for the object.
   * @param {number} amount - The number of objects required.
   */
  const findBaseMaterials = (itemId: number, amount: number) => {
    let recipe = prices.items.find((r) => r.itemId === itemId)?.recipe;

    if (!recipe) {
      return;
    }

    recipe.forEach(({ itemId, count: recipeCount }) => {
      let recipeItem = prices.items.find((r) => r.itemId === itemId);
      let count = recipeCount * amount;

      if (!firstRecipeOnly || !recipeItem?.recipe.length) {
        let material = materials.find((m) => m.itemId === itemId);
        if (material) {
          material.amount += count;
        } else {
          materials.push({ ...recipeItem, amount: count });
        }
      } else {
        findBaseMaterials(recipeItem.itemId, count);
      }
    });
  }

  objects.forEach(({ itemId, amount }) => {
    findBaseMaterials(itemId, amount);
  });

  return materials;
};


/**
 * Check if a value is an object (not a function, array, or date).
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is an object.
 */
export const isObject = (value) => {
  return typeof value === "object" && !Array.isArray(value) && !(value instanceof Date);
};


/**
 * Check if a given string is a valid UUID (Universally Unique Identifier)
 *
 * @param {string} value - The string to check
 * @returns {boolean} - true if the string is a valid UUID, false otherwise
 */
export const isUUID = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
};



/**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The input string to be capitalized.
 * @returns {string} - The capitalized string.
 */
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * @description Returns the start and end date of the current week
 * @returns {Array} array of start and end dates of the current week
 */
export const getWeekDates = (): [Date, Date] => {
  let now = new Date();
  let dayOfWeek = now.getUTCDay();
  let numDay = now.getUTCDate();

  let start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), numDay - dayOfWeek));
  start.setUTCHours(0, 0, 0, 0);

  let end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), numDay + (7 - dayOfWeek)));
  end.setUTCHours(0, 0, 0, 0);

  return [start, end];
};


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
export const isDate = (dateString: any): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
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
 * @deprecated not used
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
    ves: "fe",
    ies: "y",
    i: "us",
    zes: "ze",
    ses: "s",
    es: "e",
    s: "",
  };
  const pattern = new RegExp(`(${Object.keys(endings).join("|")})$`);
  return word.replace(pattern, (_, match) => endings[match]);
}



/**
 * @description Returns the difference between two dates
 * @param date1
 * @param date2
 * @returns
 */
export const getDateDiff = (date1: Date, date2: Date) => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const days = Math.floor(diff / (1000 * 3600 * 24));
  const hours = Math.floor((diff / (1000 * 3600)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return {
    days,
    hours,
    minutes,
    dateString: `${days} days, ${hours} hours, ${minutes} minutes`,
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
 * @deprecated not used
 */
export const groupBy = (xs: Array<any>, key: string) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};



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
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
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
