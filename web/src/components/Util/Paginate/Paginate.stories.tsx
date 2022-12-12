// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Paginate> = (args) => {
//   return <Paginate {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Paginate from './Paginate'

export const generated = () => {
  return <Paginate />
}

export default {
  title: 'Components/Paginate',
  component: Paginate,
} as ComponentMeta<typeof Paginate>
