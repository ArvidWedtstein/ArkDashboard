// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof DateCalendar> = (args) => {
//   return <DateCalendar {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import DateCalendar from './DateCalendar'

export const generated = () => {
  return <DateCalendar />
}

export default {
  title: 'Components/DateCalendar',
  component: DateCalendar,
} as ComponentMeta<typeof DateCalendar>
