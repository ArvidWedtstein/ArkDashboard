// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Slider> = (args) => {
//   return <Slider {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Slider from './Slider'

export const generated = () => {
  return <Slider />
}

export default {
  title: 'Components/Slider',
  component: Slider,
} as ComponentMeta<typeof Slider>
