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

import Collapse from './Collapse'

const meta: Meta<typeof Collapse> = {
  component: Collapse,
}

export default meta

type Story = StoryObj<typeof Collapse>

export const Primary: Story = {}
