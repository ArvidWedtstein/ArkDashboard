import React from 'react'

import humanize from 'humanize-string'

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


export const combineBySummingKeys = (...objects) => {
  const mergedObj = {};

  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      mergedObj[key] = (mergedObj[key] || 0) + obj[key];
    });
  });

  return mergedObj;
};
