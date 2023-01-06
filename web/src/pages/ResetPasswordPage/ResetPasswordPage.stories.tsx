import type { ComponentMeta } from '@storybook/react'

import ResetPasswordPage from './ResetPasswordPage'

export const generated = () => {
  return <ResetPasswordPage />
}

export default {
  title: 'Pages/ResetPasswordPage',
  component: ResetPasswordPage,
} as ComponentMeta<typeof ResetPasswordPage>
