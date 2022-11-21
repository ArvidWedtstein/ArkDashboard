import type { ComponentMeta } from '@storybook/react'

import AccountPage from './AccountPage'

export const generated = () => {
  return <AccountPage />
}

export default {
  title: 'Pages/AccountPage',
  component: AccountPage,
} as ComponentMeta<typeof AccountPage>
