import { useRef } from 'react'
import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
  EmailField,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const SignupPage = () => {
  const { isAuthenticated, signUp, client } = useAuth()

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(routes.home())
  //   }
  // }, [isAuthenticated])

  // focus on email box on page load
  // const emailRef = useRef<HTMLInputElement>(null)
  // useEffect(() => {
  //   emailRef.current?.focus()
  // }, [])

  const onSubmit = async (data) => {
    try {
      // const response = await client.auth.signUp({
      //   email: data.email,
      //   password: data.password,
      // })
      const response = await signUp({
        email: data.email,
        password: data.password,
      })

      if (response?.error) {
        toast.error(response.error)
      } else {
        toast.success('Check your email for the login link!')
        navigate(routes.home())
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <>
      <MetaTags title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Signup</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Email
                  </Label>
                  <TextField
                    name="email"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        value: true,
                        message: 'Email is required',
                      },
                    }}
                  />
                  <FieldError name="email" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />
                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      Sign Up
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Already have an account?</span>{' '}
            <Link to={routes.login()} className="rw-link">
              Log in!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
