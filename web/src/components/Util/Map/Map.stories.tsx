// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof Map> = (args) => {
//   return <Map {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Map from './Map'

export const generated = () => {
  return <Map />
}

export default {
  title: 'Components/Map',
  component: Map,
} as ComponentMeta<typeof Map>
