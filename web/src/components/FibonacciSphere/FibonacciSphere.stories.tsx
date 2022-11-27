// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof FibonacciSphere> = (args) => {
//   return <FibonacciSphere {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import FibonacciSphere from './FibonacciSphere'

export const generated = () => {
  return <FibonacciSphere />
}

export default {
  title: 'Components/FibonacciSphere',
  component: FibonacciSphere,
} as ComponentMeta<typeof FibonacciSphere>
