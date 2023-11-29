// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ThemeContext> = (args) => {
//   return <ThemeContext {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ThemeContext from './ThemeContext'

export const generated = () => {
  return <ThemeContext />
}

export default {
  title: 'Components/ThemeContext',
  component: ThemeContext,
} as ComponentMeta<typeof ThemeContext>
