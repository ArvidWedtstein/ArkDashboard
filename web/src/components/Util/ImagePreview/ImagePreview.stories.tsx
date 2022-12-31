// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ImagePreview> = (args) => {
//   return <ImagePreview {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ImagePreview from './ImagePreview'

export const generated = () => {
  return <ImagePreview />
}

export default {
  title: 'Components/ImagePreview',
  component: ImagePreview,
} as ComponentMeta<typeof ImagePreview>
