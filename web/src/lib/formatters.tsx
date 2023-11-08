import React from "react";

import humanize from "humanize-string";

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

export const jsonDisplay = (obj: unknown) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  );
};

export const isEmpty = (input: unknown): boolean => {
  if (input === null || input === undefined) {
    return true;
  }

  // For strings, trim and check if the length is zero
  if (typeof input === "string") {
    return input.trim().length === 0;
  }

  // For arrays, check if the length is zero
  if (Array.isArray(input)) {
    return input.length === 0;
  }

  // For objects, check if it has no own properties
  if (typeof input === "object") {
    return Object.keys(input).length === 0;
  }

  // For other types, consider them non-empty
  return false;
};
export const formatNumber = (
  num: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(navigator && navigator.language, options).format(num);
};

export const truncate = (value: string | number, maxlength: number = 150) => {
  let output = value?.toString() ?? "";

  if (output.length > maxlength) {
    output = output.substring(0, maxlength) + "...";
  }

  return output;
};

export const jsonTruncate = (obj: unknown, maxlength: number = 150) => {
  return truncate(JSON.stringify(obj, null, 2), maxlength);
};

interface options {
  dateStyle?: "long" | "short" | "full" | "medium";
  timeStyle?: "long" | "short" | "full" | "medium" | "none";
}
/**
 * Renders a formatted time tag element.
 *
 * @param dateTime - The date and time value to format and display.
 * @returns The formatted time tag element or an empty string if `dateTime` is not provided.
 */
export const timeTag = (
  dateTime?: string | Date,
  { dateStyle, timeStyle }: options = {}
): React.ReactNode => {
  if (!dateTime) {
    return "";
  }

  const formattedDateTime = new Date(dateTime).toLocaleString(navigator && navigator.language, {
    timeStyle: timeStyle == "none" ? undefined : timeStyle || "short",
    dateStyle: dateStyle || "long",
  });

  return (
    <time dateTime={dateTime.toString()} title={dateTime.toString()}>
      {formattedDateTime}
    </time>
  );
};

export const checkboxInputTag = (checked: boolean) => {
  return (
    <input type="checkbox" className="rw-checkbox" checked={checked} disabled />
  );
};

/**
 * Check if a value is an object (not a function, array, or date).
 * @param value - The value to check.
 * @returns A boolean indicating whether the value is an object.
 */
export const isObject = (value) => {
  return (
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
};

/**
 * Check if a given string is a valid UUID (Universally Unique Identifier)
 *
 * @param {string} value - The string to check
 * @returns {boolean} - true if the string is a valid UUID, false otherwise
 */
export const isUUID = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};

/**
 * @name isDate
 * @param {string} date
 * @returns {boolean} true if date is in 2022-11-28T14:17:14.899Z format
 * @kind function
 * @since 0.1.0
 * @summary Checks if date is in 2022-11-28T14:17:14.899Z format
 * @static true
 */
export const isDate = (dateString: string | Date | number): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 *
 * @param arr
 * @returns
 */
export const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

/**
 * Sorts an array of objects based on a specified property and sorting order.
 *
 * @template ItemType
 * @param {Array<ItemType>} array - The array to be sorted.
 * @param {string} property - The name of the property to sort by.
 * @param {boolean} ascending - If true, sorts the array in ascending order; otherwise, in descending order.
 * @returns {Array<ItemType>} - The sorted array.
 */
export const dynamicSort = <T extends {}>(
  array: Array<T>,
  property: string,
  ascending: boolean = true
): Array<T> =>
  property != "" && array
    ? [...array].sort((a: T, b: T) => {
      const aValue = a[property];
      const bValue = b[property];

      if (ascending) {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    })
    : array;

/**
 *
 * @param a bytes
 * @param b decimals
 * @returns formatted byte number
 */
export const formatBytes = (a, b = 2) => {
  if (!+a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
    }`;
};

/**
 * Capitalizes the first letter of a given string.
 * @param {string} string - The input string to be capitalized.
 * @returns {string} - The capitalized string.
 * @deprecated Use the `capitalize` tailwind method instead.
 */
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * @description Capitalize the first letter of each word in a string
 * @param sentence
 * @returns Capitalized string
 */
export const capitalizeSentence = (sentence: string) => {
  return sentence.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

/**
 *
 * @param objects
 * @returns combined object where numberic values are summed
 *
 */
export const combineBySummingKeys = (...objects: object[]) => {
  const mergedObj: { [key: string]: number } = {};
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      mergedObj[key] = (mergedObj[key] || 0) + obj[key];
    });
  });
  return mergedObj;
};

// Default Turret tower calculations
// let turretTower = {
//   size: 14 * 14,
//   cage_height: 22,
//   top_turret_height: 7,
//   total_height: 22 + 7,
//   heavy_turrets: 60,
//   tek_turrets: 65,
//   hatchframe_layers: 3,
//   turret_ring_levels: [
//     {
//       height: 10,
//       hasGenerator: false,
//     },
//     {
//       height: 14,
//       hasGenerator: true,
//     },
//     {
//       height: 18,
//       hasGenerator: false,
//     },
//     {
//       height: 29,
//       hasGenerator: true,
//     }
//   ] // 13, 16, 19, 22?
// }
// const amountCenterDoorframes = turretTower.total_height * 8
// const amountOutsideDoorframes = (Math.sqrt(turretTower.size) * 4) * turretTower.cage_height
// const amountGiantHatchframes = (turretTower.size / 4) * (turretTower.hatchframe_layers + 1) // +1 for the top of cage
// const amountCenterHatchframes = 8 * turretTower.turret_ring_levels.length
// const amountTekGen = turretTower.turret_ring_levels.filter((f) => f.hasGenerator === true).length
// let towerItems = {
//   172: turretTower.size, // Metal Foundation
//   621: amountGiantHatchframes + amountCenterHatchframes + amountTekGen, // Giant Metal Hatchframe
//   622: amountTekGen, // Giant Metal Hatchframe for Tek Generator
//   179: amountTekGen * 8, // Metal Walls to protect Tek Generator
//   168: amountTekGen * 3, // Metal Ceiling to protect Tek Generator
//   169: amountTekGen, // Metal Hatchframe to protect Tek Generator
//   178: amountTekGen, // Metal Trapdoor to protect Tek Generator
//   770: amountOutsideDoorframes + amountCenterDoorframes, // Metal Double Doorframe
//   686: turretTower.heavy_turrets, // Heavy Turret
//   681: turretTower.tek_turrets, // Tek Turret
//   676: amountTekGen, // Tek Generator
// }

type ItemRecipe = {
  __typename: string;
  id: string;
  crafting_station_id: number;
  crafting_time: number;
  yields: number;
  Item_ItemRecipe_crafted_item_idToItem?: {
    __typename: string;
    id: number;
    name: string;
    image: string;
    category: string;
    type: string;
  };
  ItemRecipeItem?: {
    __typename: string;
    id: string;
    amount: number;
    Item: {
      __typename: string;
      id: number;
      name: string;
      image: string;
    };
  }[];
};
interface RecipeState extends ItemRecipe {
  amount?: number;
}
/**
 * Calculates the base materials required to produce the specified objects.
 *
 * @param {boolean} firstRecipeOnly - If set to true, only the first recipe will be considered and
 *                                     the function will return the direct materials.
 * @param {...Object} objects - The objects for which the base materials are to be calculated.
 *
 * @returns {Array<RecipeState>} An array of objects representing the base materials required.
 */
export const getBaseMaterials = (
  baseMaterials: boolean = false,
  path: boolean = false,
  items: ItemRecipe[],
  ...objects: RecipeState[]
): RecipeState[] => {
  let materials = [];
  const findBaseMaterials = (
    item: ItemRecipe,
    amount: number,
    yields: number = 1
  ) => {
    // If has no crafting recipe, return
    if (!item?.ItemRecipeItem || item.ItemRecipeItem.length === 0) {
      return;
    }

    // Go through each crafting station? For crafting time reduction osv..
    // 128 - cooking pot
    // 601 - ind cook
    //
    // 107 - mortar and pestle
    // 607 - chem bench
    //
    // 125 - refining forge
    // 600 - ind forge
    //
    // 39 - campfire
    // 360 - ind grill
    //
    // 618 - ind grinder
    // 126 - smithy
    // 606 - beer barrel
    // 652 - tek replicator
    // 185 - fabricator
    // 525 - Castoroides Saddle
    // 572 - Thorny Dragon Saddle
    // 214 - Argentavis Saddle
    // 800 - Desmodus Saddle
    // 531 - Equus Saddle
    // Loop through each recipe grouped on crafting station
    const recipeItems = item.ItemRecipeItem;
    for (const { Item, amount: recipeAmount } of recipeItems) {
      let newRecipe = items.find(
        (i) => i.Item_ItemRecipe_crafted_item_idToItem.id === Item.id
      );

      if (!baseMaterials || !newRecipe?.ItemRecipeItem?.length || !Item) {
        const materialId = newRecipe
          ? newRecipe.Item_ItemRecipe_crafted_item_idToItem.id
          : Item.id;

        let material = materials.find(
          (m) => m.Item_ItemRecipe_crafted_item_idToItem.id === materialId
        );

        const count = (recipeAmount * amount) / yields;

        if (material) {
          material.amount += count;
          // material.crafting_time += count * (newRecipe?.crafting_time || 1);
        } else {
          material = {
            ...(newRecipe || { Item_ItemRecipe_crafted_item_idToItem: Item }),
            amount: count,
            crafting_time: count * (newRecipe?.crafting_time || 1),
          };
          materials.push(material);
        }
      } else if (newRecipe) {
        findBaseMaterials(newRecipe, recipeAmount * amount, newRecipe.yields);
      }
    }
  };

  // TODO: Check for right recipe for selected crafting stations
  const getRecipeById = (recipeId: number, crafting_stations?: any[]) => {
    return items.find(
      (recipe) => recipe.Item_ItemRecipe_crafted_item_idToItem.id === recipeId
    );
  };

  const recipeTree = (recipe, amount: number = 1) => {
    if (!recipe.ItemRecipeItem)
      return {
        ...recipe,
        amount: recipe.amount * amount,
        crafting_time: recipe.amount * (recipe.crafting_time || 1),
      };

    const processedItems = recipe.ItemRecipeItem.map((itemRecipeItem) => {
      const processedItem = {
        ...itemRecipeItem,
        amount: (itemRecipeItem.amount * recipe.amount) / recipe.yields,
        crafting_time:
          (itemRecipeItem.amount / recipe.yields) * (recipe.crafting_time || 1),
      };

      const nestedRecipe = getRecipeById(itemRecipeItem.Item.id);

      if (nestedRecipe) {
        processedItem.Item = {
          ...processedItem.Item,
          ...nestedRecipe.Item_ItemRecipe_crafted_item_idToItem,
        };

        if (nestedRecipe.ItemRecipeItem) {
          processedItem.ItemRecipeItem = nestedRecipe.ItemRecipeItem.map(
            (nestedItemRecipeItem) =>
              recipeTree(nestedItemRecipeItem, processedItem.amount)
          );
        }
      }
      return processedItem;
    });
    return {
      ...recipe,
      crafting_time: (recipe.crafting_time || 1) * amount,
      Item: recipe.Item_ItemRecipe_crafted_item_idToItem,
      ItemRecipeItem: processedItems,
    };
  };

  objects.forEach((item) => {
    if (path) {
      materials.push(recipeTree(item, item.amount));
    } else findBaseMaterials(item, item.amount, item.yields);
  });
  return materials;
};

interface Coordinate {
  lat: number;
  lon: number;
}

export const findShortestPath = (coordinates: Coordinate[]): Coordinate[] => {
  const path: Coordinate[] = [];

  // Start with the first coordinate and remove it from the array
  let currentCoord = coordinates.shift();
  path.push(currentCoord);

  // Continue adding the nearest coordinate to the path until there are no more coordinates
  while (coordinates.length > 0) {
    let nearestCoord = coordinates[0];
    let shortestDistance = distance(currentCoord, nearestCoord);

    // Find the nearest coordinate to the current coordinate
    for (let i = 1; i < coordinates.length; i++) {
      const candidateCoord = coordinates[i];
      const candidateDistance = distance(currentCoord, candidateCoord);
      if (candidateDistance < shortestDistance) {
        nearestCoord = candidateCoord;
        shortestDistance = candidateDistance;
      }
    }

    // Add the nearest coordinate to the path and remove it from the array
    path.push(nearestCoord);
    coordinates = coordinates.filter((coord) => coord !== nearestCoord);

    // Update the current coordinate to the nearest one
    currentCoord = nearestCoord;
  }

  return path;
};

export const distance = (
  { lat: lat1, lon: lon1 }: Coordinate,
  { lat: lat2, lon: lon2 }: Coordinate
) => {
  const latDiff = lat1 - lat2;
  const lonDiff = lon1 - lon2;
  return (latDiff ** 2 + lonDiff ** 2) ** 0.5;
};

/**
 * Formats the given number of seconds into a string representation
 * with the format "d days h hours m minutes s seconds".
 * If the `onlyLast` parameter is set to `true`, only the last non-zero unit is displayed.
 * If the `useAbs` parameter is set to `true` and the number of days is greater than 30,
 * the function returns the month and day of the corresponding date.
 *
 * @param {number} seconds - The number of seconds to format.
 * @param {boolean} [onlyLast=false] - Whether to display only the last non-zero unit.
 * @param {boolean} [useAbs=true] - Whether to use the absolute value of the input.
 *
 * @return {string} The formatted string representation.
 */
export const timeFormatL = (seconds, onlyLast = false) => {
  let time = "";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;

  if (days > 0) {
    time += `${days}d `;
    if (onlyLast) {
      return time.trim().split(" ").pop();
    }
  }
  if (hours > 0) {
    time += `${hours}h `;
    if (onlyLast) {
      return time.trim().split(" ").pop();
    }
  }

  if (minutes > 0) {
    time += `${minutes}m `;
    if (onlyLast) {
      // return time.trim().split(" ").pop();
    }
  }
  if (sec > 0 || time === "") {
    time += `${Math.round(sec)}s`;
  }
  return time.trim();
};

/**
 *
 * @param date
 * @param value
 * @param unit
 * @returns
 */
export const addToDate = (
  date: Date,
  value: number = 0,
  unit: "day" | "week" | "month" | "year" = "day"
) => {
  const result = new Date(date);

  if (unit === "day") {
    result.setDate(result.getDate() + value);
  } else if (unit === "week") {
    result.setDate(result.getDate() + value * 7);
  } else if (unit === "month") {
    result.setMonth(result.getMonth() + value);
  } else if (unit === "year") {
    result.setFullYear(result.getFullYear() + value);
  }

  return result;
};

/**
 *  Returns an array of dates between the two dates
 * @param currentDay
 * @param lastDay
 * @returns
 */
export const getDaysBetweenDates = (
  currentDay: Date,
  lastDay: Date
): Date[] => {
  return Array.from(
    { length: (+lastDay - +currentDay) / (24 * 60 * 60 * 1000) + 1 },
    (_, index) => {
      return addToDate(new Date(currentDay), index, "day");
    }
  );
};

export const toLocalPeriod = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
};

/**
 *
 * @param firstDayOfWeek
 * @returns
 */
export const getDateUnit = (
  type: "weekday" | "month" = "weekday",
  firstDayOfWeek = 1
): Date[] => {
  const days: Date[] = [];
  let date = new Date();

  // Set the date to the first day of the week (Monday)

  if (type === "month") {
    date.setMonth(0);
  } else {
    date.setDate(date.getDate() - ((date.getDay() - firstDayOfWeek + 7) % 7));
  }

  // Get the weekdays (Monday to Sunday)
  for (let i = 0; i < (type === "weekday" ? 7 : 12); i++) {
    days.push(new Date(date));
    if (type === "weekday") {
      date.setDate(date.getDate() + 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
  }

  return days;
};

/**
 *
 * @param date
 * @returns
 */
export const toLocaleISODate = (date: Date | null) => {
  if (!date) return;
  return `${date.getFullYear()}-${(date.getMonth() + 1 + "").padStart(
    2,
    "0"
  )}-${(date.getDate() + "").padStart(2, "0")}`;
};

/**
 * Get Start or End of a period
 * @param date
 * @param type
 * @param period
 * @param startOn
 * @returns
 */
export const adjustCalendarDate = (
  date: Date,
  type: "start" | "end",
  period: "day" | "week" | "month" | "year",
  startOn = 0
): Date => {
  const result = new Date(date);

  if (type === "start") {
    if (period === "day") {
      result.setUTCHours(0, 0, 0, 0);
    } else if (period === "week") {
      const dayOfWeek = result.getUTCDay();
      const diff = (dayOfWeek - startOn + 7) % 7;
      result.setUTCDate(result.getUTCDate() - diff);
    } else if (period === "month") {
      result.setDate(1);
    } else if (period === "year") {
      result.setUTCMonth(0, 1);
    }
  } else if (type === "end") {
    if (period === "day") {
      result.setUTCHours(23, 59, 59, 999);
    } else if (period === "month") {
      result.setMonth(result.getMonth() + 1, 0);
    } else if (period === "week") {
      const dayOfWeek = result.getUTCDay();
      const diff = (6 - dayOfWeek + 7) % 7;
      result.setUTCDate(result.getUTCDate() + diff);
    } else if (period === "year") {
      result.setUTCMonth(11, 31);
    }
  }

  return result;
};

/**
 *
 * @param date
 * @returns
 */
export const getISOWeek = (date: Date = new Date()): number => {
  const dayMs = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const daysSinceStart = Math.floor((+date - +startOfYear) / dayMs);
  const dayOfWeek = date.getUTCDay(); // Get the day of the week, where Monday is 0 and Sunday is 6
  const weekNumber = Math.ceil((daysSinceStart + 1 - dayOfWeek) / 7);

  // If it's a Sunday (dayOfWeek = 6), consider it as part of the next week
  if (dayOfWeek === 6) {
    return weekNumber + 1;
  }

  return weekNumber;
};

export function toISODate(date: Date): string;
export function toISODate(date: null): null;
export function toISODate(date: Date | null): string | null {
  if (date) {
    return date.toISOString().split("T")[0];
  }

  return null;
}

/**
 *
 * @param date
 * @param unit
 * @returns
 */
export const relativeDate = (date: Date | string): string => {
  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - new Date(date).getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
    localeMatcher: "best fit",
  });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-minutes, "minute");
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-hours, "hour");
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return rtf.format(-days, "day");
  }
};

/**
 * Determines the type of a word based on regular expressions.
 * @param {string} word - The word to determine the type of.
 * @returns {string} The type of the word. Can be "noun", "verb", "adjective", or "unknown".
 */
export const getWordType = (word: string) => {
  // Define regular expressions for each word type
  const nounRegex = /^[A-Z][a-z]*$/;
  const verbRegex = /^[a-z]+(?:ed|ing)$/;
  const adjRegex = /^[a-z]+(?:able|ible|ful|ic|ous|ish|ive|less)$/;

  // Test the word against each regex
  if (nounRegex.test(word)) return "noun";
  if (verbRegex.test(word)) return "verb";
  if (adjRegex.test(word)) return "adjective";
  return "unknown";
};

/**
 *
 * @param {number} min - minimum number
 * @param {number} max - maximum number
 * @returns a random number between min and max
 */
export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
  const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
  return `${timestamp}-${randomString}`;
};

export const arrRandNoRep = (arr: any[]) => {
  let lastElement = null;
  let randomIndex = null;

  do {
    randomIndex = Math.floor(Math.random() * arr.length);
  } while (arr[randomIndex] === lastElement);

  lastElement = arr[randomIndex];
  return lastElement;
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
};

/**
 * Returns a pluralized string based on the count and noun provided.
 *
 * @param {number} count - The number of items.
 * @param {string} noun - The noun to be pluralized.
 * @param {string} [suffix='s'] - The suffix to be added to the noun.
 * @param {boolean} [includeCount=true] - The suffix to be added to the noun.
 * @return {string} - The pluralized string.
 */
export const pluralize = (
  count: number,
  noun: string,
  suffix = "s",
  includeCount: boolean = true
): string => `${includeCount ? count : ""} ${noun}${count !== 1 ? suffix : ""}`;

/**
 * @description Returns the difference between two dates
 * @param date1
 * @param date2
 * @returns
 */
export const getDateDiff = (date1: Date, date2: Date) => {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  const years = Math.round(diff / (1000 * 3600 * 24 * 365));
  const months = Math.round(diff / (1000 * 3600 * 24 * 30));
  const days = Math.floor(diff / (1000 * 3600 * 24));
  const hours = Math.floor((diff / (1000 * 3600)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return {
    years,
    months,
    days,
    hours,
    minutes,
    dateString: `${days} days, ${hours} hours, ${minutes} minutes`,
  };
};

export const formatXYtoLatLon = (
  map_id: number,
  options: { x?: number; y?: number },
  reverse: boolean = false
) => {
  let subtractX = 0;
  let multiplierX = 0;
  let subtractY = 0;
  let multiplierY = 0;

  /**
   * Latitude corresponds to the Y coordinate,
   * and Longitude corresponds to X. To convert the Lat/Long map coordinates to UE coordinates,
   * simply subtract the shift value, and multiply by the right multiplier from the following table.
   */

  switch (map_id) {
    case 1: //  Valguero
      subtractX = 50;
      multiplierX = 8160;
      subtractY = 50;
      multiplierY = 8160;
    case 2: // the island
      subtractX = 50;
      multiplierX = 8000;
      subtractY = 50;
      multiplierY = 8000;
    case 3: // the center
      // lon
      subtractX = 55.1;
      multiplierX = 9600;

      // lat
      subtractY = 30.34;
      multiplierY = 9584;
    case 4: // ragnarok
      subtractX = 50;
      multiplierX = 13100;
      subtractY = 50;
      multiplierY = 13100;
    case 5: // abberation
      subtractX = 50;
      multiplierX = 8000;
      subtractY = 50;
      multiplierY = 8000;
    case 6: // extinction
      subtractX = 50;
      multiplierX = 8000;
      subtractY = 50;
      multiplierY = 8000;
    case 7: // scorched earth
      subtractX = 50;
      multiplierX = 8000;
      subtractY = 50;
      multiplierY = 8000;
    case 8: // genesis part 1
      subtractX = 50;
      multiplierX = 10500;
      subtractY = 50;
      multiplierY = 10500;
    case 9: // genesis part 2
      subtractX = 50;
      multiplierX = 14500;
      subtractY = 50;
      multiplierY = 14500;
    case 10: // crystal isles
      // lon
      subtractX = 50;
      multiplierX = 17000;

      // lat
      subtractY = 48.75;
      multiplierY = 16000;
    case 11: // fjordur
      subtractX = 0;
      multiplierX = 0;
      subtractY = 0;
      multiplierY = 0;
    case 12: // Lost island
      // lon
      subtractX = 49.02;
      multiplierX = 15300;

      // lat
      subtractY = 51.634;
      multiplierY = 15300;
  }

  // From Lat/Long to UE
  // return (options.x - subtract) * multiplier

  // From UE to Lat/Long
  return {
    lat: reverse
      ? (options.y - subtractY) * multiplierY
      : Math.floor(options.y / multiplierY + subtractY),
    lon: reverse
      ? (options.x - subtractX) * multiplierX
      : Math.floor(options.x / multiplierX + subtractX),
  };
};

export const svgArc = (
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  startAngle: number,
  endAngle: number,
  largeArcFlag: boolean = false,
  sweepFlag: boolean = true
): string => {
  // Convert angles from degrees to radians
  startAngle = (startAngle * Math.PI) / 180;
  endAngle = (endAngle * Math.PI) / 180;

  // Calculate the start and end points of the arc
  const startX = centerX + radiusX * Math.cos(startAngle);
  const startY = centerY + radiusY * Math.sin(startAngle);
  const endX = centerX + radiusX * Math.cos(endAngle);
  const endY = centerY + radiusY * Math.sin(endAngle);

  // Use the A command to create the arc path
  const arcCommand = `A ${radiusX} ${radiusY} 0 ${largeArcFlag ? 1 : 0} ${sweepFlag ? 1 : 0
    } ${endX} ${endY}`;

  // Construct the full path command
  const pathData = `M ${startX} ${startY} ${arcCommand}`;

  return pathData;
};

// export const catmullRomInterpolation = (t: number, p0: number, p1: number, p2: number, p3: number): number => {
//   const t2 = t * t;
//   const t3 = t * t2;
//   return 0.5 * (
//     (2 * p1) +
//     (-p0 + p2) * t +
//     (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
//     (-p0 + 3 * p1 - 3 * p2 + p3) * t3
//   );
// }
export const catmullRomInterpolation = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number => {
  const t2 = t * t;
  const t3 = t2 * t;
  const a = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
  const b = p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3;
  const c = -0.5 * p0 + 0.5 * p2;
  const d = p1;
  return a * t3 + b * t2 + c * t + d;
};

export const drawCatmullRomChart = (
  points: [number, number][],
  numPoints: number = 100
): { x: number; y: number }[] => {
  const result: { x: number; y: number }[] = [];
  const numSegments = points.length - 1;

  for (let i = 0; i < numSegments; i++) {
    const p0 = i > 0 ? points[i - 1][1] : points[i][1];
    const p1 = points[i][1];
    const p2 = points[i + 1][1];
    const p3 = i < numSegments - 1 ? points[i + 2][1] : p2;

    for (let j = 0; j < numPoints; j++) {
      const t = j / numPoints;
      const interpolatedValue = catmullRomInterpolation(t, p0, p1, p2, p3);
      result.push({
        x: points[i][0] + t * (points[i + 1][0] - points[i][0]),
        y: interpolatedValue,
      });
    }
  }

  return result;
};

interface SvgPath {
  pathData: string;
}

export const mergeOverlappingSvgPaths = (paths: SvgPath[]): SvgPath => {
  // Combine all path data into one string
  const allPathData = paths.map((path) => path.pathData).join("");

  // Split the path data into individual commands
  const commands = allPathData.split(/(?=[A-Za-z])/).filter(Boolean);

  // Initialize variables to store the merged path data
  let mergedPathData = "";
  let currentCommand = "";
  let currentArgs: string[] = [];

  // Helper function to append a command and its arguments to the merged path
  const appendCommand = () => {
    if (currentCommand) {
      mergedPathData += currentCommand + currentArgs.join(" ");
      currentArgs = [];
      currentCommand = "";
    }
  };

  // Iterate through the commands
  for (const command of commands) {
    if (/^[A-Za-z]$/.test(command)) {
      // If a new command is encountered, append the previous one
      appendCommand();
      currentCommand = command;
    } else {
      // Otherwise, accumulate arguments
      currentArgs.push(command);
    }
  }

  // Append the last command
  appendCommand();
  console.log(mergedPathData);
  return { pathData: mergedPathData };
};

interface Point {
  x: number;
  y: number;
}

interface Rectangle {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
}
/**
 *
 * @param start
 * @param end
 * @example <caption>Example usage of calculateCorners.</caption>
 * // returns { topLeft: { x: 0, y: 0 }, topRight: { x: 10, y: 0 }, bottomLeft: { x: 0, y: 10 }, bottomRight: { x: 10, y: 10 } }
 * calculateCorners({ x: 0, y: 0 }, { x: 10, y: 10 });
 *
 * @returns  {Rectangle} coordinates
 */
export const calculateCorners = (start: Point, end: Point): Rectangle => {
  const topLeft: Point = {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
  };

  const topRight: Point = {
    x: Math.max(start.x, end.x),
    y: Math.min(start.y, end.y),
  };

  const bottomLeft: Point = {
    x: Math.min(start.x, end.x),
    y: Math.max(start.y, end.y),
  };

  const bottomRight: Point = {
    x: Math.max(start.x, end.x),
    y: Math.max(start.y, end.y),
  };

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  };
};

/**
 * Generates a pdf from an array of your choice
 */

export const generatePDF = (crafts) => {
  const pages = [];
  const tableSize = {
    width: 612,
    height: 792,
  };

  const content = [];
  const columnWidths = [100, 20, 30];

  // https://blog.idrsolutions.com/make-your-own-pdf-file-part-5-path-objects/

  const newobj = (name, obj: string[]) => {
    content.push(...[`${name} 0 obj`, obj.join("\n"), "endobj"]);
  };

  const newpage = (pageref, size, contentref) => {
    pages.push(`${pageref} 0 R`);
    newobj(pageref, [
      `<< /Type /Page`,
      `/Parent 2 0 R`,
      `/Resources 4 0 R`,
      `/Contents ${contentref}`,
      `/MediaBox [0 0 ${size.width} ${size.height}]`,
      `>>`,
    ]);
  };
  /**
   *
   * @param x text from left
   * @param y  text from top
   * @param text text to write
   * @param size font size
   * @returns a string to write text
   */
  const text = (x, y, text, size) =>
    [
      `BT`,
      `/F1 ${size} Tf`,
      `${x} ${tableSize.height - y} Td`,
      `(${text}) Tj`,
      `ET`,
    ].join("\n");

  const rect = (
    x,
    y,
    width,
    height,
    fill: boolean = true,
    color: string = "0 0 0 "
  ) =>
    [
      `${color} rg`,
      `${x} ${tableSize.height - y} ${width} ${height} re ${fill ? "f" : ""} S`,
      `0 0 0 rg`,
    ].join("\n");

  /**
   * @param x x coordinate
   * @param y y coordinate
   * @param lines lines to draw
   * @returns a string to draw lines
   * @example
   * lines(0, 0, [
   * { x: 0, y: 0, c: [{ x: 0, y: 0 }] },
   * { x: 0, y: 0, c: [{ x: 0, y: 0 }] },
   * ])
   *
   */
  const line = (x = 0, y = 0, lines = []) => {
    const path = [`${x} ${tableSize.height - y} m`];
    lines.forEach((line) => {
      path.push(`${line.x} ${tableSize.height - line.y} l`);
    });
    path.push("h");
    path.push("S");
    return path.join("\n");
  };

  const tableX = 72;
  const textcolor = "0.2 0.2 0.2 rg";
  const cellPadding = 3;

  content.push("%PDF-2.0");

  newobj("1", [`<< /Type /Catalog /Pages 2 0 R >>`]);

  // newpage("3", tableSize, "6 0 R");

  newobj("4", [`<< /Font << /F1 5 0 R >> >>`]);

  newobj("5", [`<< /Type /Font /Subtype /Type1 /BaseFont /Papyrus >>`]);
  // const generateObjectNumber = () => Math.floor(content.length / 2 + 1);
  // newobj("6", [
  //   `<< /Length 105 >>`,
  //   `stream`,
  //   text(72, 30, "Hello World!", 24),
  //   text(72, 50, "Hello woooorld!", 24),
  //   `endstream`,
  // ]);

  newpage("8", tableSize, `9 0 R`);

  newobj("9", [
    `<< /Length 105>>`,
    `stream`,
    rect(
      tableX - cellPadding * 2,
      30 + crafts.length * 20,
      tableX +
      (Object.keys(crafts[0]).length - 1) *
      (tableSize.width / Object.keys(crafts[0]).length) +
      columnWidths[Object.keys(crafts[0]).length - 1],
      40 + (crafts.length - 1) * 20 + cellPadding,
      true,
      `0.9 0.9 0.9`
    ),
    Object.keys(crafts[0])
      .map((key, col) => {
        return [
          text(
            col === 0
              ? tableX
              : 0 + col * (tableSize.width / Object.keys(crafts[0]).length),
            20,
            key,
            12
          ),
          ...crafts.map((item, i) => {
            const t = [];
            const cellX =
              (col === 0 ? tableX : 0) +
              col * (tableSize.width / Object.keys(crafts[0]).length);
            // const cellX = (col === 0 ? tableX : 0) + columnWidths[col];
            const cellY = 40 + i * 20;
            // Line
            col === 0 && t.push(`${textcolor}`);

            // t.push(rect(cellX, cellY, tableSize.width / crafts.length, 12 + cellPadding * 2, false))
            if (col === 0) {
              t.push(
                line(cellX, cellY + cellPadding, [
                  {
                    x:
                      tableX +
                      (Object.keys(crafts[0]).length - 1) *
                      (tableSize.width / Object.keys(crafts[0]).length) +
                      columnWidths[Object.keys(crafts[0]).length - 1],
                    y: cellY + cellPadding,
                  },
                ])
              );
            }
            // Text
            const textX = cellX + cellPadding;
            const textY = cellY - cellPadding;

            t.push(text(textX, textY, `${item[key]}`, 12));

            t.push("0 0 0 rg");

            return t.join("\n");
          }),
        ].join("\n");
      })
      .join("\n"),
    "endstream",
  ]);

  newobj("2", [
    `<< /Type /Pages /Kids [${pages.join(" ")}] /Count ${pages.length} >>`,
  ]);
  const xrefOffset = content.join("\n").length;

  content.push("xref");
  content.push(`0 ${content.length}`);
  content.push(`
  0 7
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000212 00000 n
0000000250 00000 n
0000000317 00000 n
`);
  content.push("trailer");
  content.push(`<< /Size ${content.length} /Root 1 0 R >>`);
  content.push("startxref");
  content.push(xrefOffset); // bytes from start of file to xref
  content.push("%%EOF"); // end of file

  const pdfContent = content.join("\n");
  const dataURI = `data:application/pdf;base64,${btoa(pdfContent)}`;

  const win = window.open();
  win.document.write(
    `<iframe src="${dataURI}" style="width:100%; height:100%;" frameborder="0"></iframe>`
  );

  return dataURI;
};

/**
 * Removes duplicates from an array and returns a new array.
 * @note  function only works on arrays containing primitive data types
 * @param {T} arr - The input array.
 * @return {T} - The array with duplicates removed.
 */
export const removeDuplicates = <T extends {}>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 *
 * @param {number} seriesCount - The number of series to generate colors for.
 * @returns
 */
export const generateChartColors = (seriesCount: number): string[] => {
  const baseColors: string[] = [];
  const colorThreshold = 100; // Adjust as needed

  for (let i = 0; i < seriesCount; i++) {
    let r, g, b;
    do {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
    } while (
      baseColors.some((color) => {
        const [cr, cg, cb] = color.match(/\d+/g).map((c) => parseInt(c, 10));
        return (
          Math.abs(r - cr) < colorThreshold &&
          Math.abs(g - cg) < colorThreshold &&
          Math.abs(b - cb) < colorThreshold
        );
      })
    );

    baseColors.push(`rgb(${r}, ${g}, ${b})`);
  }

  // Ensure the colors are visible on a dark background
  return baseColors.map((color) => {
    let [r, g, b] = color.match(/\d+/g).map((c) => parseInt(c, 10));
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (luminance > 0.5) {
      // If the color is too light for a dark background, make it darker
      const ratio = 0.8; // Adjust as needed
      r = Math.floor(r * ratio);
      g = Math.floor(g * ratio);
      b = Math.floor(b * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return color;
    }
  });
};

/**
 * Returns color from red to green based on percentage
 * @param percentage
 * @returns
 */
export const getHexCodeFromPercentage = (percentage: number): string => {
  // Ensure the input percentage is within the range [0, 100]
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));

  // Calculate the RGB values based on the percentage
  const red = (255 * (100 - normalizedPercentage)) / 100;
  const green = (255 * normalizedPercentage) / 100;

  // Convert RGB values to a hex code
  const hexCode = `#${((red << 16) + (green << 8))
    .toString(16)
    .padStart(6, "0")}`;

  return hexCode;
};

/**
 * Groups the elements of an array based on the provided key.
 *
 * @param {Array} xs - The input array.
 * @param {string} key - The key to group by.
 * @return {Object} - An object where each key is a unique value of the provided key and the value is an array of elements that have that key value.
 */

export const groupBy = <T extends {}>(
  array: T[],
  key: string
): { [groupKey: string]: T[] } => {
  const nestedKeys = key.split(".");

  return array.reduce((acc: { [groupKey: string]: T[] }, obj: T) => {
    let groupKey: any = obj; // Use 'any' type for indexing
    for (const nestedKey of nestedKeys) {
      groupKey = groupKey[nestedKey];
    }

    if (!acc.hasOwnProperty(groupKey)) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(obj);
    return acc;
  }, {});
};

type NestedKey<T> = string | (string | number)[];

/**
 *
 * @param obj
 * @param nestedKey
 * @returns
 * @example
 * const obj = {
 * a: {
 *  b: {
 *   c: 1,
 * },
 * },
 * };
 * getValueByNestedKey(obj, "a.b.c"); // 1
 * getValueByNestedKey(obj, ["a", "b", "c"]); // 1
 * getValueByNestedKey(obj, "a.b.d"); // undefined
 */
export const getValueByNestedKey = <T extends object>(
  obj: T,
  nestedKey: NestedKey<T>
): unknown => {
  const keys = Array.isArray(nestedKey) ? nestedKey : nestedKey.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
};

/**
 * @description debounce function for search fields
 * @param func
 * @param wait
 * @returns
 * @example
 *  const handleSearch = debounce((e) => setSearch(e.target.value))
 */
export const debounce = <F extends (...args: any[]) => void>(
  func: F,
  wait = 300
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<F>) {
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
export const clamp = (
  value: number,
  min: number | undefined,
  max: number | undefined
) => {
  return Math.min(
    Math.max(value, min ?? Number.MIN_VALUE),
    max ?? Number.MAX_VALUE
  );
};

type Colors =
  | "red"
  | "purple"
  | "blue"
  | "green"
  | "slate"
  | "stone"
  | "gray"
  | "lime"
  | "neutral"
  | "zinc"
  | "orange"
  | "amber"
  | "yellow"
  | "pea";
type Luminance = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type BgColor = `bg-${Colors}-${Luminance}`;
export type TextColor = `text-${Colors}-${Luminance}`;
export type TextSize = `text-${Size}`;
export type FillColor = `fill-${Colors}-${Luminance}`;
export type StrokeColor = `stroke-${Colors}-${Luminance}`;
export type Color = `${Colors}-${Luminance}`;

type Distance = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Breakpoints = "xs:" | "sm:" | "md:" | "lg:" | "xl:" | "";
type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Space = `${Breakpoints}space-${"x" | "y"}-${Distance}`;
type Padding = `${Breakpoints}p-${Distance}`;

export type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

/**
 * @description ensures that a key exists on an object
 * @example
 * type EnsureKeyExists<T, K extends keyof T> = Array<Required<Pick<T, K>> & Partial<T>>;
 *
 * interface ExampleObject {
 *  id: number;
 *  name: string;
 *  age: number;
 * }
 *
 * const array: EnsureKeyExists<ExampleObject, 'name'> = [
 *  { name: 'John', age: 25 },
 *  { name: 'Jane', age: 30 },
 *  { name: 'Bob', age: 40 },
 * ];
 *
 * @see https://stackoverflow.com/a/49936686/2391795
 */
export type EnsureKeyExists<T, K extends keyof T> = Array<
  Required<Pick<T, K>> & Partial<T>
>;

/**
 * Converts array type to single type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export class SimplexNoise3D {
  private static grad3: number[][] = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ];

  private static perm: number[] = [...Array(512)].map((_, i) => i % 256);

  constructor(seed: number) {
    const source = [...SimplexNoise3D.perm];
    for (let i = 0; i < 256; i++) {
      const r = i + Math.floor(Math.random() * (256 - i));
      const temp = source[i];
      source[i] = source[r];
      source[r] = temp;
    }
    SimplexNoise3D.perm = [...source, ...source];
  }

  private static dot(g: number[], x: number, y: number, z: number): number {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  noise(xin: number, yin: number, zin: number): number {
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;

    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);

    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1, j1, k1;
    let i2, j2, k2;

    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    const gi0 =
      SimplexNoise3D.perm[
      ii + SimplexNoise3D.perm[jj + SimplexNoise3D.perm[kk]]
      ] % 12;
    const gi1 =
      SimplexNoise3D.perm[
      ii + i1 + SimplexNoise3D.perm[jj + j1 + SimplexNoise3D.perm[kk + k1]]
      ] % 12;
    const gi2 =
      SimplexNoise3D.perm[
      ii + i2 + SimplexNoise3D.perm[jj + j2 + SimplexNoise3D.perm[kk + k2]]
      ] % 12;
    const gi3 =
      SimplexNoise3D.perm[
      ii + 1 + SimplexNoise3D.perm[jj + 1 + SimplexNoise3D.perm[kk + 1]]
      ] % 1;

    let n0, n1, n2, n3;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * SimplexNoise3D.dot(SimplexNoise3D.grad3[gi0], x0, y0, z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * SimplexNoise3D.dot(SimplexNoise3D.grad3[gi1], x1, y1, z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * SimplexNoise3D.dot(SimplexNoise3D.grad3[gi2], x2, y2, z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 < 0) n3 = 0.0;
    else {
      t3 *= t3;
      n3 = t3 * t3 * SimplexNoise3D.dot(SimplexNoise3D.grad3[gi3], x3, y3, z3);
    }

    return 32.0 * (n0 + n1 + n2 + n3);
  }
}

type UseControlledOptions<T> = {
  controlled?: T | undefined;
  default?: T;
  name?: string;
  state?: string;
};

type UseControlledReturnValue<T> = [T, (newValue: T) => void];

export const useControlled = <T extends unknown>({
  controlled,
  default: defaultProp,
  name = "",
  state = "value",
}: UseControlledOptions<T>): UseControlledReturnValue<T> => {
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValue] = React.useState(defaultProp);
  const value = isControlled ? controlled as T : valueState;

  if (process.env.NODE_ENV !== "production") {
    React.useEffect(() => {
      if (isControlled !== (controlled !== undefined)) {
        console.error(
          [
            `ArkDashboard: A component is changing the ${isControlled ? "" : "un"
            }controlled ${state} state of ${name} to be ${isControlled ? "un" : ""
            }controlled.`,
            "Elements should not switch from uncontrolled to controlled (or vice versa).",
            `Decide between using a controlled or uncontrolled ${name} ` +
            "element for the lifetime of the component.",
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            ,
          ].join("\n")
        );
      }
    }, [state, name, controlled]);

    const { current: defaultValue } = React.useRef(defaultProp);
    React.useEffect(() => {
      if (!isControlled && defaultValue !== defaultProp) {
        console.error(
          [
            `ArkDashboard: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. ` +
            `To suppress this warning opt to use a controlled ${name}.`,
          ].join("\n")
        );
      }
    }, [JSON.stringify(defaultProp)]);
  }

  const setValueIfUncontrolled = React.useCallback((newValue: T) => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);
  return [value, setValueIfUncontrolled];
};

export function useEventCallback<
  Fn extends (...args: any[]) => any = (...args: unknown[]) => unknown
>(fn: Fn): Fn;
export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return;
export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = React.useRef(fn);
  ref.current = fn;
  return React.useRef((...args: Args) =>
    // @ts-expect-error hide `this`
    // tslint:disable-next-line:ban-comma-operator
    (0, ref.current!)(...args)
  ).current;
}

export const usePreviousProps = <T extends {}>(value: T) => {
  const ref = React.useRef<T | {}>({});
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current as Partial<T>;
};

