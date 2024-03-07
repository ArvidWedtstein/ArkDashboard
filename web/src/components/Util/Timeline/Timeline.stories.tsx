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

import Timeline from './Timeline'

const meta: Meta<typeof Timeline> = {
  component: Timeline,
}

export default meta

type Story = StoryObj<typeof Timeline>

export const Primary: Story = {}
