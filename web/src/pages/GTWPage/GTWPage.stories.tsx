import type { ComponentMeta } from '@storybook/react'

import GtwPage from './GtwPage'

export const generated = () => {
  return <GtwPage />
}

export default {
  title: 'Pages/GtwPage',
  component: GtwPage,
} as ComponentMeta<typeof GtwPage>
