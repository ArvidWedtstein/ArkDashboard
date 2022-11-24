import type { ComponentMeta } from '@storybook/react'

import AdminPage from './AdminPage'

export const generated = () => {
  return <AdminPage />
}

export default {
  title: 'Pages/AdminPage',
  component: AdminPage,
} as ComponentMeta<typeof AdminPage>
