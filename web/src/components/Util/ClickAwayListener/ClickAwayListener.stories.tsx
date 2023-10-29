// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ClickAwayListener> = (args) => {
//   return <ClickAwayListener {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ClickAwayListener from './ClickAwayListener'

export const generated = () => {
  return <ClickAwayListener />
}

export default {
  title: 'Components/ClickAwayListener',
  component: ClickAwayListener,
} as ComponentMeta<typeof ClickAwayListener>
