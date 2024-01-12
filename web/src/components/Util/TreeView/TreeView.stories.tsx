// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import TreeView from './TreeView'

const meta: Meta<typeof TreeView> = {
  component: TreeView,
}

export default meta

type Story = StoryObj<typeof TreeView>

export const Primary: Story = {}
