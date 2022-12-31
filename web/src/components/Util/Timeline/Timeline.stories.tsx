// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Timeline> = (args) => {
//   return <Timeline {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Timeline from './Timeline'

export const generated = () => {
  return <Timeline />
}

export default {
  title: 'Components/Timeline',
  component: Timeline,
} as ComponentMeta<typeof Timeline>
