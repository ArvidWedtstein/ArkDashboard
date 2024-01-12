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

import ColorInput from './ColorInput'

const meta: Meta<typeof ColorInput> = {
  component: ColorInput,
}

export default meta

type Story = StoryObj<typeof ColorInput>

export const Primary: Story = {}
