import React from 'react'

import humanize from 'humanize-string'
import prices from '../../public/arkitems.json'
const MAX_STRING_LENGTH = 150

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

export const truncate = (value: string | number) => {
  let output = value?.toString() ?? ''

  if (output.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + '...'
  }

  return output
}

export const jsonTruncate = (obj: unknown) => {
  return truncate(JSON.stringify(obj, null, 2))
}

export const timeTag = (dateTime?: string) => {
  let output: string | JSX.Element = ''

  if (dateTime) {
    let options: Intl.DateTimeFormatOptions = {
      weekday: "long", year: "numeric", month: "short",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    output = (
      <time dateTime={dateTime} title={dateTime}>
        {new Date(dateTime).toLocaleString('no-NO', options)}
      </time>
    )
  }
  return output
}

export const checkboxInputTag = (checked: boolean) => {
  return <input type="checkbox" checked={checked} disabled />
}

export const compare = (a: any, b: any) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

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
      mergedObj[res.itemId] = (mergedObj[res.itemId] || 0) + (res["count"] * obj.amount);
    })
  });


  return mergedObj;
};
export const isObject = (value) => {
  return (
    !!value &&
    typeof value === "object" &&
    typeof value.getMonth !== "function" &&
    !Array.isArray(value)
  );
};
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
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
}

export const isDate = (date: any): boolean => {
  // regex test for  2022-11-28T14:17:14.899Z format
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
  return regex.test(date)
}
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