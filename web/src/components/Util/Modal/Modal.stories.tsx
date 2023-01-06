// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Modal> = (args) => {
//   return <Modal {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Modal from './Modal'

export const generated = () => {
  return <Modal />
}

export default {
  title: 'Components/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>
