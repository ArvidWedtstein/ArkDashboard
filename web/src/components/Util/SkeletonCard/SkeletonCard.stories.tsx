// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof SkeletonCard> = (args) => {
//   return <SkeletonCard {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import SkeletonCard from './SkeletonCard'

export const generated = () => {
  return <SkeletonCard />
}

export default {
  title: 'Components/SkeletonCard',
  component: SkeletonCard,
} as ComponentMeta<typeof SkeletonCard>
