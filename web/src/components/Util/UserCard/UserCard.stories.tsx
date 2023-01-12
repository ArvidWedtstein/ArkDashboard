// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof UserCard> = (args) => {
//   return <UserCard {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import UserCard from './UserCard'

export const generated = () => {
  return <UserCard />
}

export default {
  title: 'Components/UserCard',
  component: UserCard,
} as ComponentMeta<typeof UserCard>
