// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof CheckboxGroup> = (args) => {
//   return <CheckboxGroup {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import CheckboxGroup from './CheckboxGroup'

export const generated = () => {
  return <CheckboxGroup />
}

export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
} as ComponentMeta<typeof CheckboxGroup>
