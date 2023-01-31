// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof MapPicker> = (args) => {
//   return <MapPicker {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import MapPicker from './MapPicker'

export const generated = () => {
  return <MapPicker />
}

export default {
  title: 'Components/MapPicker',
  component: MapPicker,
} as ComponentMeta<typeof MapPicker>
