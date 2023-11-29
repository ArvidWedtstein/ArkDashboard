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

import List from './List'

const meta: Meta<typeof List> = {
  component: List,
}

export default meta

type Story = StoryObj<typeof List>

export const Primary: Story = {}
