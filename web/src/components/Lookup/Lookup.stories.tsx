// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Lookup> = (args) => {
//   return <Lookup {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Lookup from './Lookup'

export const generated = () => {
  return <Lookup />
}

export default {
  title: 'Components/Lookup',
  component: Lookup,
} as ComponentMeta<typeof Lookup>
