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

import Text from './Text'

const meta: Meta<typeof Text> = {
  component: Text,
}

export default meta

type Story = StoryObj<typeof Text>

export const Primary: Story = {}
