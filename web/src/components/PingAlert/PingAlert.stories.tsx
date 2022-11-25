// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof PingAlert> = (args) => {
//   return <PingAlert {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import PingAlert from './PingAlert'

export const generated = () => {
  return <PingAlert />
}

export default {
  title: 'Components/PingAlert',
  component: PingAlert,
} as ComponentMeta<typeof PingAlert>
