// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Chat> = (args) => {
//   return <Chat {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Chat from './Chat'

export const generated = () => {
  return <Chat />
}

export default {
  title: 'Components/Chat',
  component: Chat,
} as ComponentMeta<typeof Chat>
