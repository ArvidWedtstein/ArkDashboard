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

export const jsonDisplay = (obj: unknown) => {
  return (
    <pre>
      <code>{JSON.stringify(obj, null, 2)}</code>
    </pre>
  );
};

export const formatNumber = (
  num: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat("en-GB", options).format(num);
  // const formattedNum = Math.round(num)
  //   .toString()
  //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // return formattedNum;
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


// const dateFormatter = new Intl.DateTimeFormat("en-GB", {
// 	day: "2-digit",
// 	month: "2-digit",
// 	year: "numeric",
// 	timeZone: "utc",
// });

// const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
// 	day: "2-digit",
// 	month: "2-digit",
// 	year: "numeric",
// 	hour: "2-digit",
// 	minute: "2-digit",
// 	timeZone: "utc",
// });
/**
 * Renders a formatted time tag element.
 *
 * @param dateTime - The date and time value to format and display.
 * @returns The formatted time tag element or an empty string if `dateTime` is not provided.
 */
export const timeTag = (dateTime?: string | Date): string | React.ReactNode => {
  if (!dateTime) {
    return "";
  }

  const formattedDateTime = new Date(dateTime).toLocaleString("en-GB", {
    timeStyle: "short",
    dateStyle: "long",
  });

  return (
    <time dateTime={dateTime.toString()} title={dateTime.toString()}>
      {formattedDateTime}
    </time>
  );
};

export const checkboxInputTag = (checked: boolean) => {
  return <input type="checkbox" checked={checked} disabled />;
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
export const isDate = (dateString: any): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Sorts an array of objects based on the value of a property
 *
 * @param {string} property - The property name to sort the objects by
 * @returns {(a: any, b: any) => number} A comparison function that can be passed to `Array.sort` method.
 */
export const dynamicSort = (property: string) => {
  const sortOrder = property[0] === "-" ? -1 : 1;
  const sortKey = property[0] === "-" ? property.substring(1) : property;

  return (a: any, b: any) => {
    const result =
      a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
    return result * sortOrder;
  };
};
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
/**
 * Calculates the base materials required to produce the specified objects.
 *
 * @param {boolean} firstRecipeOnly - If set to true, only the first recipe will be considered and
 *                                     the function will return the direct materials.
 * @param {...Object} objects - The objects for which the base materials are to be calculated.
 *
 * @returns {Array<any>} An array of objects representing the base materials required.
 */
export const getBaseMaterials = (
  baseMaterials: boolean = false,
  items: any[],
  ...objects: Array<any>
) => {
  let materials = [];
  const findBaseMaterials = (item, amount, yields = 1) => {
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
      try {
        let newRecipe = items.find((i) => i.crafted_item_id === Item.id);

        if (!baseMaterials || !newRecipe?.ItemRecipeItem?.length || !Item) {
          const materialId = newRecipe ? newRecipe.crafted_item_id : Item.id;
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
      } catch (error) { }
    }
  };

  objects.forEach((item) => {
    findBaseMaterials(item, item.amount, item.yields);
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
 * @description Returns the start and end date of the current week
 * @returns {Array} array of start and end dates of the current week
 */
export const getWeekDates = (): [Date, Date] => {
  let now = new Date();
  let dayOfWeek = now.getUTCDay();
  let numDay = now.getUTCDate();

  let start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), numDay - dayOfWeek)
  );
  start.setUTCHours(0, 0, 0, 0);

  let end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), numDay + (7 - dayOfWeek))
  );
  end.setUTCHours(0, 0, 0, 0);

  return [start, end];
};

export const rtf = new Intl.RelativeTimeFormat("en", {
  localeMatcher: "best fit", // other values: "lookup"
  numeric: "always", // other values: "auto"
  style: "long", // other values: "short" or "narrow"
}).format;

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


/**
 * Generates a pdf from an array of your choice
 */

export const generatePDF = () => {
  const content = [];
  const crafts = [
    {
      name: "Knitting",
      amount: 5,
    }
  ];

  content.push("%PDF-1.3");
  content.push("1 0 obj");
  content.push("<< /Type /Catalog /Pages 2 0 R >>");
  content.push("endobj");

  content.push("2 0 obj");
  content.push("<< /Type /Pages /Kids [3 0 R 6 0 R 4 0 R] /Count 2 >>");
  content.push("endobj");

  content.push("3 0 obj");
  content.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>");
  content.push("endobj");

  content.push("4 0 obj");
  content.push("<< /Length 66 >>");
  content.push("stream");
  content.push("BT");
  content.push("/F1 12 Tf");
  content.push("72 720 Td");

  const tableX = 72;
  const tableY = 700;
  const cellPadding = 10;
  const tableWidth = 400;
  const tableHeight = 300;

  const generateObjectNumber = () => Math.floor(content.length / 2 + 1);

  crafts.forEach((item, i) => {
    for (let col = 0; col < 3; col++) {
      const cellX = tableX + col * (tableWidth / 3);
      const cellY = tableY - i * (tableHeight / crafts.length);

      content.push(`${cellX} ${cellY + 5 - tableHeight / crafts.length} m`);
      content.push(
        `${cellX + tableWidth / crafts.length} ${cellY + 5 - tableHeight / crafts.length} l`
      );
      content.push("S");

      const textX = cellX + cellPadding;
      const textY = cellY - cellPadding;
      content.push("BT");

      content.push("1 0 0 rg");
      content.push("/F1 12 Tf");

      if (i === 0) {
        content.push(`${cellX} ${cellY + 30 - tableHeight / crafts.length} m`);
        content.push(
          `${cellX + tableWidth / crafts.length} ${cellY + 30 - tableHeight / crafts.length} l`
        );
        content.push("S");
        content.push(`${textX} ${textY + 20} Td`);

        switch (col) {
          case 0:
            content.push(`(Name) Tj`);
            break;
          case 1:
            content.push(`(Amount) Tj`);
            break;
          case 2:
            content.push(`(Time) Tj`);
            break;
        }
        content.push("ET");
      }

      content.push("BT");
      content.push(`${textX} ${textY} Td`);

      switch (col) {
        case 0:
          content.push("0 0 0 rg");
          content.push(`(${item.name}) Tj`);
          break;
        case 1:
          content.push("0 0 0 rg");
          content.push(`(${item.amount}) Tj`);
          break;
        case 2:
          content.push("0 0 0 rg");
          content.push(`(${item.amount}s) Tj`);
          break;
      }

      content.push("ET");
    }
  });

  content.push("ET");
  content.push("endstream");
  content.push("endobj");

  content.push("6 0 obj");
  content.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 7 0 R >>");
  content.push("endobj");

  content.push("7 0 obj");
  content.push("<< /Length 66 >>");
  content.push("stream");
  content.push("BT");
  content.push("/F1 12 Tf");
  content.push("72 720 Td");


  crafts.forEach((item, i) => {
    Object.keys(crafts[0]).forEach((key, col) => {
      const cellX = tableX + col * (tableWidth / 3);
      const cellY = tableY - i * (tableHeight / crafts.length);

      content.push(`${cellX} ${cellY + 5 - tableHeight / crafts.length} m`);
      content.push(
        `${cellX + tableWidth / crafts.length} ${cellY + 5 - tableHeight / crafts.length} l`
      );
      content.push("S");

      const textX = cellX + cellPadding;
      const textY = cellY - cellPadding;
      content.push("BT");

      content.push("1 0 0 rg");
      content.push("/F1 12 Tf");

      if (i === 0) {
        content.push(`${cellX} ${cellY + 30 - tableHeight / crafts.length} m`);
        content.push(
          `${cellX + tableWidth / crafts.length} ${cellY + 30} l`
        );
        content.push("S");
        content.push(`${textX} ${textY + 20} Td`);
        content.push(`(${key}) Tj`);
        content.push("ET");
      }

      content.push("BT");
      content.push(`${textX} ${textY} Td`);

      content.push("0 0 0 rg");
      content.push(`(${item[key]}) Tj`);

      content.push("ET");
    });
  });

  content.push("ET");
  content.push("endstream");
  content.push("endobj");

  const xrefOffset = content.join("\n").length;

  content.push("xref");
  content.push(`0 ${content.length / 2 + 1}`);
  content.push("0000000000 65535 f");
  content.push("0000000009 00000 n");
  content.push("trailer");
  content.push(`<< /Size ${content.length / 2 + 1} /Root 1 0 R >>`);
  content.push("startxref");
  content.push(xrefOffset);
  content.push("%%EOF");

  const pdfContent = content.join("\n");
  const dataURI = `data:application/pdf;base64,${btoa(pdfContent)}`;

  const win = window.open();
  win.document.write(
    `<iframe src="${dataURI}" style="width:100%; height:100%;" frameborder="0"></iframe>`
  );
};


/**
 * Removes duplicates from an array and returns a new array.
 * @note  function only works on arrays containing primitive data types
 * @param {Array} arr - The input array.
 * @return {Array} - The array with duplicates removed.
 */
export const removeDuplicates = (array: unknown[]): unknown[] => {
  return [...new Set(array)];
};

/**
 * Groups the elements of an array based on the provided key.
 *
 * @param {Array} xs - The input array.
 * @param {string} key - The key to group by.
 * @return {Object} - An object where each key is a unique value of the provided key and the value is an array of elements that have that key value.
 */
export const groupBy = <T extends {}>(xs: T[], key: string): { [groupKey: string]: T[] } => {
  const nestedKeys = key.split(".");

  return xs.reduce((acc: { [groupKey: string]: T[] }, obj: T) => {
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
export type FillColor = `fill-${Colors}-${Luminance}`;
export type StrokeColor = `stroke-${Colors}-${Luminance}`;
export type Color = `${Colors}-${Luminance}`;

type Distance = 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type Breakpoints = "xs:" | "sm:" | "md:" | "lg:" | "xl:" | "";
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
