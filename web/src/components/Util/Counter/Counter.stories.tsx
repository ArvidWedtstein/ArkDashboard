// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Counter> = (args) => {
//   return <Counter {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Counter from './Counter'

export const generated = () => {
  return <Counter />
}

export default {
  title: 'Components/Counter',
  component: Counter,
} as ComponentMeta<typeof Counter>
