import type { ComponentMeta } from '@storybook/react'

import ForgotPasswordPage from './ForgotPasswordPage'

export const generated = () => {
  return <ForgotPasswordPage />
}

export default {
  title: 'Pages/ForgotPasswordPage',
  component: ForgotPasswordPage,
} as ComponentMeta<typeof ForgotPasswordPage>
