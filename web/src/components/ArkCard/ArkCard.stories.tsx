// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ArkCard> = (args) => {
//   return <ArkCard {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ArkCard from './ArkCard'

export const generated = () => {
  return <ArkCard />
}

export default {
  title: 'Components/ArkCard',
  component: ArkCard,
} as ComponentMeta<typeof ArkCard>
