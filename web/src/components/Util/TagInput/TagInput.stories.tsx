// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof TagInput> = (args) => {
//   return <TagInput {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import TagInput from './TagInput'

export const generated = () => {
  return <TagInput />
}

export default {
  title: 'Components/TagInput',
  component: TagInput,
} as ComponentMeta<typeof TagInput>
