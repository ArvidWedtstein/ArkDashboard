// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Popper> = (args) => {
//   return <Popper {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Popper from './Popper'

export const generated = () => {
  return <Popper />
}

export default {
  title: 'Components/Popper',
  component: Popper,
} as ComponentMeta<typeof Popper>
