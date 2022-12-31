import type { ComponentMeta } from '@storybook/react'

import StoryPage from './StoryPage'

export const generated = () => {
  return <StoryPage />
}

export default {
  title: 'Pages/StoryPage',
  component: StoryPage,
} as ComponentMeta<typeof StoryPage>
