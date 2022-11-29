// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Table> = (args) => {
//   return <Table {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Table from './Table'

export const generated = () => {
  return <Table />
}

export default {
  title: 'Components/Table',
  component: Table,
} as ComponentMeta<typeof Table>
