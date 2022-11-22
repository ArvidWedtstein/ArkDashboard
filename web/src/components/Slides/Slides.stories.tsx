// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Slides> = (args) => {
//   return <Slides {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Slides from './Slides'

export const generated = () => {
  return <Slides />
}

export default {
  title: 'Components/Slides',
  component: Slides,
} as ComponentMeta<typeof Slides>
