// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof MaterialGrid> = (args) => {
//   return <MaterialGrid {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import MaterialGrid from './MaterialGrid'

export const generated = () => {
  return <MaterialGrid />
}

export default {
  title: 'Components/MaterialGrid',
  component: MaterialGrid,
} as ComponentMeta<typeof MaterialGrid>
