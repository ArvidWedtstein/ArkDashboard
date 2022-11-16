import type { ComponentMeta } from '@storybook/react'

import MaterialCalculatorPage from './MaterialCalculatorPage'

export const generated = () => {
  return <MaterialCalculatorPage />
}

export default {
  title: 'Pages/MaterialCalculatorPage',
  component: MaterialCalculatorPage,
} as ComponentMeta<typeof MaterialCalculatorPage>
