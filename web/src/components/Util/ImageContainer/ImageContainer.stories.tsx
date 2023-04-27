// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ImageContainer> = (args) => {
//   return <ImageContainer {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ImageContainer from './ImageContainer'

export const generated = () => {
  return <ImageContainer />
}

export default {
  title: 'Components/ImageContainer',
  component: ImageContainer,
} as ComponentMeta<typeof ImageContainer>
