// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Chart> = (args) => {
//   return <Chart {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Chart from './Chart'

export const generated = () => {
  return <Chart />
}

export default {
  title: 'Components/Chart',
  component: Chart,
} as ComponentMeta<typeof Chart>
