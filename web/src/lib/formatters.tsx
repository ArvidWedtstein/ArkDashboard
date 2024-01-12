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
  return new Intl.NumberFormat(navigator && navigator.language, options).format(
    num
  );
};

export const truncate = (value: string | number, maxlength: number = 150) => {
  let output = value?.toString() ?? "";

  if (output.length > maxlength) {
    output = output.substring(0, maxlength) + "...";
  }

  return output;
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

  const formattedDateTime = new Date(dateTime).toLocaleString(
    navigator && navigator.language,
    {
      timeStyle: timeStyle == "none" ? undefined : timeStyle || "short",
      dateStyle: dateStyle || "long",
    }
  );

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
 * Sorts an array of objects based on a specified property and sorting order.
 *
 * @template ItemType
 * @param {Array<ItemType>} array - The array to be sorted.
 * @param {string} property - The name of the property to sort by.
 * @param {boolean} ascending - If true, sorts the array in ascending order; otherwise, in descending order.
 * @returns {Array<ItemType>} - The sorted array.
 */
export const dynamicSort = <T extends Record<string, any>>(
  array: Array<T>,
  property: keyof T | string,
  ascending: boolean = true
): Array<T> =>
  property != "" && array
    ? array.toSorted((a: T, b: T) => {
      const properties = (typeof property === 'string' ? property.split(".") : [property]) as Array<string | keyof T>;
      let aValue: any = a;
      let bValue: any = b;

      for (const prop of properties) {
        aValue = aValue[prop];
        bValue = bValue[prop];
      }

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

/**
 * Formats the given number of seconds into a string representation
 * with the format "d days h hours m minutes s seconds".
 * If the `onlyLast` parameter is set to `true`, only the last non-zero unit is displayed.
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
      return time.trim().split(" ").pop();
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


/**
 *
 * @param date
 * @param unit
 * @returns "time" ago
 */
export const relativeDate = (date: Date | string, style?: Intl.RelativeTimeFormatStyle): string => {
  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - new Date(date).getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
    localeMatcher: "lookup",
    style: style,
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
 * @description Returns the difference between two dates
 * @param date1
 * @param date2
 * @returns
 */
export const getDateDiff = (date1: Date, date2: Date) => {
  const diff = Math.abs(date1.getTime() - date2.getTime());

  const years = Math.floor(diff / (1000 * 3600 * 24 * 365));
  const months = Math.floor(diff / (1000 * 3600 * 24 * 30));
  const days = Math.floor(diff / (1000 * 3600 * 24));
  const hours = Math.floor((diff / (1000 * 3600)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  const dates = [];
  let currentDate = new Date(date1);

  while (currentDate <= date2) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const dateString = `${days} days, ${hours} hours, ${minutes} minutes`;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    dates,
    dateString,
  };
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
 * Converts object to search params, and removed duplicates
 * @param obj
 * @returns
 */
export const objectToSearchParams = (obj): URLSearchParams => {
  const params = new URLSearchParams();

  // Iterate through the object properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (Array.isArray(value)) {
        const uniqueValues = Array.from(new Set(value));

        if (uniqueValues.length > 1) {
          // If more than one unique value, concatenate with commas
          params.append(key, uniqueValues.filter(d => d !== undefined && d !== "").join(','));
        } else {
          // Only one unique value, add it directly
          if (uniqueValues[0] !== undefined && uniqueValues[0] !== "") params.append(key, uniqueValues[0].toString());
        }
      } else {
        // Non-array values

        if (value !== undefined && value !== "" && value) params.append(key, value?.toString());
      }
    }
  }

  return params;
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


// Color Converting Functions

/**
 * Converts Rgb to Hex
 * @param rgb
 * @returns
 */
export const RgbToHex = (rgb: string) => {

  if (!/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.test(rgb)) {
    if (process.env.NODE_ENV !== "production") {
      console.error('Invalid format', rgb)
    }
    return rgb;
  }
  const rgbValues = rgb.match(/\d+/g);

  if (rgbValues?.length === 3) {
    const [r, g, b] = rgbValues.map(Number);
    const hex = ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
    return `#${hex}`;
  }
}

/**
 * Converts Rgb To Hsl
 * @param r
 * @param g
 * @param b
 * @returns
 */
export const RgbToHsl = (r: number, g: number, b: number): [hue: number, saturation: number, lightness: number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Lightness
  const l = (min + max) / 2;

  // Saturation
  let s = 0;
  if (min !== max) {
    s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2.0 - max - min);
  }

  // Hue
  let h = 0;
  if (min !== max) {
    if (max === r) {
      h = (g - b) / (max - min) + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / (max - min) + 2;
    } else if (max === b) {
      h = (r - g) / (max - min) + 4;
    }

    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Converts Hex to Hsl
 * @param hex
 * @returns
 */
export const HexToHsl = (hex: string): [hue: number, saturation: number, lightness: number] => {
  const bigint = parseInt(hex.replace(/^#/, ""), 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Converts Hex value to RGB
 * @param hex
 * @returns
 */
export const HexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace(/^#/, ""), 16)
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts Hsl Value to Hex
 * @param h
 * @param s
 * @param l
 * @returns
 */
export const HslToHex = (h: number, s: number, l: number): string => {
  if (!/^hsl\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*\)$/i.test(`hsl(${h}, ${s}%, ${l}%)`)) {
    if (process.env.NODE_ENV !== "production") {
      console.error('Invalid format HslToHex', h, s, l)
    }
    return `${h}${s}${l}`;
  }
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Groups the elements of an array based on the provided key.
 *
 * @param {Array} xs - The input array.
 * @param {string} key - The key to group by.
 * @return {Object} - An object where each key is a unique value of the provided key and the value is an array of elements that have that key value.
 */

export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T | string,
): { [groupKey: string]: T[] } => {
  const nestedKeys = (typeof key === 'string' ? key.split(".") : [key]) as Array<string | keyof T>;

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

export type Colors =
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
export type Luminance =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;
export type BgColor = `bg-${Colors}-${Luminance}`;
export type TextColor = `text-${Colors}-${Luminance}`;
export type TextSize = `text-${Size}`;
export type FillColor = `fill-${Colors}-${Luminance}`;
export type StrokeColor = `stroke-${Colors}-${Luminance}`;
export type Color =
  | `${Colors}-${Luminance}`
  | "transparent"
  | "current"
  | "none"
  | "white"
  | "black";

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
 * Converts array type to single type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


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
  const value = isControlled ? (controlled as T) : valueState;

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