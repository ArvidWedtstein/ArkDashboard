// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Slideshow> = (args) => {
//   return <Slideshow {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Slideshow from './Slideshow'

export const generated = () => {
  return <Slideshow />
}

export default {
  title: 'Components/Slideshow',
  component: Slideshow,
} as ComponentMeta<typeof Slideshow>
