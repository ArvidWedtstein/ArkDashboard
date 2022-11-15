import type { ComponentMeta } from '@storybook/react'

import TamingPage from './TamingPage'

export const generated = () => {
  return <TamingPage />
}

export default {
  title: 'Pages/TamingPage',
  component: TamingPage,
} as ComponentMeta<typeof TamingPage>
