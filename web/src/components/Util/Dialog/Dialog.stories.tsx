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

import Dialog from './Dialog'

const meta: Meta<typeof Dialog> = {
  component: Dialog,
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Primary: Story = {}
