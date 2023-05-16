// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof DataTable> = (args) => {
//   return <DataTable {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import DataTable from './DataTable'

export const generated = () => {
  return <DataTable />
}

export default {
  title: 'Components/DataTable',
  component: DataTable,
} as ComponentMeta<typeof DataTable>
