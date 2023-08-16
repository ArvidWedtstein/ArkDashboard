// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Toast> = (args) => {
//   return <Toast {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Toast from './Toast'

export const generated = () => {
  return <Toast />
}

export default {
  title: 'Components/Toast',
  component: Toast,
} as ComponentMeta<typeof Toast>
