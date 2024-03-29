// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Ripple> = (args) => {
//   return <Ripple {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Ripple from './Ripple'

export const generated = () => {
  return <Ripple />
}

export default {
  title: 'Components/Ripple',
  component: Ripple,
} as ComponentMeta<typeof Ripple>
