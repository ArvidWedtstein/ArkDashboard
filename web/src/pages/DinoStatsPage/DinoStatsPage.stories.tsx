import type { ComponentMeta } from '@storybook/react'

import DinoStatsPage from './DinoStatsPage'

export const generated = () => {
  return <DinoStatsPage />
}

export default {
  title: 'Pages/DinoStatsPage',
  component: DinoStatsPage,
} as ComponentMeta<typeof DinoStatsPage>
