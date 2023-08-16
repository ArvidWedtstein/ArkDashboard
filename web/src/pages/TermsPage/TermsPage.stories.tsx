import type { ComponentMeta } from '@storybook/react'

import TermsPage from './TermsPage'

export const generated = () => {
  return <TermsPage />
}

export default {
  title: 'Pages/TermsPage',
  component: TermsPage,
} as ComponentMeta<typeof TermsPage>
