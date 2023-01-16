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


  // focus on email box on page load
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const response = await signUp({
        email: data.email,
        password: data.password,
      })

      if (response?.error) {
        toast.error(JSON.stringify(response.error))
      } else {
        toast.success('Check your email for the login link!')
        // navigate(routes.home())
      }
    } catch (error) {
      toast.error(error.message)
    }
    return
  }
  return (
    <>
      <MetaTags title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="dark:text-white text-gray-600 my-4 mx-auto max-w-lg">
          <div className="w-full">
            <header className="text-center">
              <h2 className="rw-heading-secondary font-semibold text-lg">Signup</h2>
            </header>

            <div className="">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="email"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    </div>
                    <TextField
                      name="email"
                      className="rw-input pl-10"
                      errorClassName="rw-input rw-input-error"
                      placeholder="ola@nordmann.com"
                      autoFocus
                      validation={{
                        required: {
                          value: true,
                          message: "Email is required",
                        },
                        pattern: {
                          message: "Email must be valid",
                          value: /[^@]+@[^\.]+\..+/,
                        }
                      }}
                    />
                    <FieldError name="email" className="rw-field-error" />
                  </div>

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
            <Link to={routes.signin()} className="rw-link">
              Log in!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
