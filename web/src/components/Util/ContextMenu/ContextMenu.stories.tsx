// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ContextMenu> = (args) => {
//   return <ContextMenu {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ContextMenu from './ContextMenu'

export const generated = () => {
  return <ContextMenu />
}

export default {
  title: 'Components/ContextMenu',
  component: ContextMenu,
} as ComponentMeta<typeof ContextMenu>
