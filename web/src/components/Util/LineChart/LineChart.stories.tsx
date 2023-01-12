// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof LineChart> = (args) => {
//   return <LineChart {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import LineChart from './LineChart'

export const generated = () => {
  return <LineChart />
}

export default {
  title: 'Components/LineChart',
  component: LineChart,
} as ComponentMeta<typeof LineChart>
