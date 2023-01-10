// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof PieChart> = (args) => {
//   return <PieChart {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import PieChart from './PieChart'

export const generated = () => {
  return <PieChart />
}

export default {
  title: 'Components/PieChart',
  component: PieChart,
} as ComponentMeta<typeof PieChart>
