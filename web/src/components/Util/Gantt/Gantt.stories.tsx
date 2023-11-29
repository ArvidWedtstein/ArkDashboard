// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Gantt> = (args) => {
//   return <Gantt {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Gantt from './Gantt'

export const generated = () => {
  return <Gantt />
}

export default {
  title: 'Components/Gantt',
  component: Gantt,
} as ComponentMeta<typeof Gantt>
