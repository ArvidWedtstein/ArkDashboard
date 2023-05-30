// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof NewTable> = (args) => {
//   return <NewTable {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import NewTable from './NewTable'

export const generated = () => {
  return <NewTable />
}

export default {
  title: 'Components/NewTable',
  component: NewTable,
} as ComponentMeta<typeof NewTable>
