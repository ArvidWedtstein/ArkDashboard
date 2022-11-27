// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof BoxIndent> = (args) => {
//   return <BoxIndent {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import BoxIndent from './BoxIndent'

export const generated = () => {
  return <BoxIndent />
}

export default {
  title: 'Components/BoxIndent',
  component: BoxIndent,
} as ComponentMeta<typeof BoxIndent>
