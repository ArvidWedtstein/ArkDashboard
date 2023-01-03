import React from "react";

import humanize from "humanize-string";
import prices from "../../public/arkitems.json";
const MAX_STRING_LENGTH = 150;

export const formatEnum = (values: string | string[] | null | undefined) => {
  let output = "";

  if (Array.isArray(values)) {
    const humanizedValues = values.map((value) => humanize(value));
    output = humanizedValues.join(", ");
  } else if (typeof values === "string") {
    output = humanize(values);
  }

  return output;
};

export const truncate = (value: string | number) => {
  let output = value?.toString() ?? "";

  if (output.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + "...";
  }

  return output;
};

export const jsonTruncate = (obj: unknown) => {
  return truncate(JSON.stringify(obj, null, 2));
};

export const timeTag = (dateTime?: string) => {
  let output: string | JSX.Element = "";

  if (dateTime) {
    let options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    output = (
      <time dateTime={dateTime} title={dateTime}>
        {new Date(dateTime).toLocaleString("no-NO", options)}
      </time>
    );
  }
  return output;
};

export const checkboxInputTag = (checked: boolean) => {
  return <input type="checkbox" checked={checked} disabled />;
};

/**
 * Sorts an array of T by the specified properties of property

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

export const combineBySummingKeys = (...objects) => {
  const mergedObj = {};

  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      mergedObj[key] = (mergedObj[key] || 0) + obj[key];
    });
  });

  return mergedObj;
};
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
export const isDate = (date: string): boolean => {
  // regex test for  2022-11-28T14:17:14.899Z format
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return regex.test(date);
};
/**
 *
 * @param {Number} amount
 * @param {String} item_type
 * @returns Object with prices
 */
export const calcItemCost = (amount, item_type) => {
  if (Number.isNaN(amount)) return console.error("Amount is NaN");
  if (!(item_type in prices))
    return console.error(
      "\x1b[31m%s\x1b[0m",
      `[ArkMatCalc Error]: ${item_type} not found in prices`
    );
  let price = {};
  Object.entries(prices[item_type]).forEach((i) => {
    const [key, val]: any = i;
    if (prices.hasOwnProperty(key)) {
      price = combineBySummingKeys(calcItemCost(val, key), price);
    } else {
      price[`${key}`] = val * Number(amount);
    }
  });
  return price;
};

// const calcItemPrice = (itemId: number, amount: number) => {
//   if (items.some((i) => i.itemId === parseInt(key))) {

//   }
// }

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

// get date difference in days, hours and minutes

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
export const groupBy2 = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}