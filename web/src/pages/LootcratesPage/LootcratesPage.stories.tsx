import type { ComponentMeta } from '@storybook/react'

import LootcratesPage from './LootcratesPage'

export const generated = () => {
  return <LootcratesPage />
}

export default {
  title: 'Pages/LootcratesPage',
  component: LootcratesPage,
} as ComponentMeta<typeof LootcratesPage>
