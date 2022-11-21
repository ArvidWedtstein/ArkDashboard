import { useRef, useState } from 'react'
import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

const WELCOME_MESSAGE = 'Welcome back!'
const REDIRECT = routes.home()

const LoginPage = ({ type }) => {
  // const {
  //   isAuthenticated,
  //   client,
  //   loading,
  //   logIn,
  //   reauthenticate,
  // } = useAuth()

  // const [shouldShowclient, setShouldShowclient] = useState(false)
  // const [showclient, setShowclient] = useState(
  //   client.isEnabled() && type !== 'password'
  // )

  // // should redirect right after login or wait to show the client prompts?
  // useEffect(() => {
  //   if (isAuthenticated && (!shouldShowclient || client.isEnabled())) {
  //     navigate(REDIRECT)
  //   }
  // }, [isAuthenticated, shouldShowclient])
  // // useEffect(() => {
  // //   if (isAuthenticated) {
  // //     navigate(REDIRECT)
  // //   }
  // // }, [isAuthenticated])

  // // if client is enabled, show the prompt as soon as the page loads
  // useEffect(() => {
  //   if (!loading && !isAuthenticated && showclient) {
  //     onAuthenticate()
  //   }
  // }, [loading, isAuthenticated])
  // // useEffect(() => {
  // //   if (!loading && !isAuthenticated) {
  // //     onAuthenticate()
  // //   }
  // // }, [loading, isAuthenticated])

  // // focus on the username field as soon as the page loads
  // const usernameRef = useRef(null)
  // // const passwordRef = useRef(null)
  // useEffect(() => {
  //   usernameRef.current && usernameRef.current?.focus()
  // }, [])

  // const onSubmit = async (data) => {
  //   const clientSupported = await client.isSupported()

  //   if (clientSupported) {
  //     setShouldShowclient(true)
  //   }
  //   const response = await logIn({ ...data })

  //   if (response.message) {
  //     // auth details good, but user not logged in
  //     toast(response.message)
  //   } else if (response.error) {
  //     // error while authenticating
  //     toast.error(response.error)
  //   } else {
  //     // user logged in
  //     if (clientSupported) {
  //       setShowclient(true)
  //     } else {
  //       toast.success(WELCOME_MESSAGE)
  //     }
  //   }
  // }

  // const onAuthenticate = async () => {
  //   try {
  //     // let resp = await logIn({ email: usernameRef.current.value, password: passwordRef.current.value })
  //     await client.authenticate()
  //     await reauthenticate()
  //     // console.log(resp)
  //     toast.success(WELCOME_MESSAGE)
  //     navigate(REDIRECT)
  //   } catch (e) {
  //     if (e.name === 'clientDeviceNotFoundError') {
  //       toast.error(
  //         'Device not found, log in with username/password to continue'
  //       )
  //       setShowclient(false)
  //     } else {
  //       toast.error(e.message)
  //     }
  //   }
  // }

  // const onRegister = async () => {
  //   try {
  //     await client.register()
  //     toast.success(WELCOME_MESSAGE)
  //     navigate(REDIRECT)
  //   } catch (e) {
  //     toast.error(e.message)
  //   }
  // }

  // const onSkip = () => {
  //   toast.success(WELCOME_MESSAGE)
  //   setShouldShowclient(false)
  // }

  // const AuthclientPrompt = () => {
  //   return (
  //     <div className="rw-client-wrapper">
  //       <h2>client Login Enabled</h2>
  //       <p>Log in with your fingerprint, face or PIN</p>
  //       <div className="rw-button-group">
  //         <button className="rw-button rw-button-blue" onClick={onAuthenticate}>
  //           Open Authenticator
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  // const RegisterclientPrompt = () => (
  //   <div className="rw-client-wrapper">
  //     <h2>No more passwords!</h2>
  //     <p>
  //       Depending on your device you can log in with your fingerprint, face or
  //       PIN next time.
  //     </p>
  //     <div className="rw-button-group">
  //       <button className="rw-button rw-button-blue" onClick={onRegister}>
  //         Turn On
  //       </button>
  //       <button className="rw-button" onClick={onSkip}>
  //         Skip for now
  //       </button>
  //     </div>
  //   </div>
  // )

  // const PasswordForm = () => (
  //   <Form onSubmit={onSubmit} className="rw-form-wrapper">
  //     <Label
  //       name="username"
  //       className="rw-label"
  //       errorClassName="rw-label rw-label-error"
  //     >
  //       Username
  //     </Label>
  //     <TextField
  //       name="username"
  //       className="rw-input"
  //       errorClassName="rw-input rw-input-error"
  //       ref={usernameRef}
  //       autoFocus
  //       validation={{
  //         required: {
  //           value: true,
  //           message: 'Username is required',
  //         },
  //       }}
  //     />

  //     <FieldError name="username" className="rw-field-error" />

  //     <Label
  //       name="password"
  //       className="rw-label"
  //       errorClassName="rw-label rw-label-error"
  //     >
  //       Password
  //     </Label>
  //     <PasswordField
  //       name="password"
  //       className="rw-input"
  //       errorClassName="rw-input rw-input-error"
  //       autoComplete="current-password"
  //       // ref={passwordRef}
  //       validation={{
  //         required: {
  //           value: true,
  //           message: 'Password is required',
  //         },
  //       }}
  //     />

  //     <div className="rw-forgot-link">
  //       <Link to={routes.forgotPassword()} className="rw-forgot-link">
  //         Forgot Password?
  //       </Link>
  //     </div>

  //     <FieldError name="password" className="rw-field-error" />

  //     <div className="rw-button-group">
  //       <Submit className="rw-button rw-button-blue">Login</Submit>
  //     </div>
  //   </Form>
  // )

  // const formToRender = () => {
  //   let showclient = false
  //   if (showclient) {
  //     if (client.isEnabled()) {
  //       return <AuthclientPrompt />
  //     } else {
  //       return <RegisterclientPrompt />
  //     }
  //   } else {
  //     return <PasswordForm />
  //   }
  // }

  // const linkToRender = () => {
  //   let showclient = false
  //   if (showclient) {
  //     if (client.isEnabled()) {
  //       return (
  //         <div className="rw-login-link">
  //           <span>or login with </span>{' '}
  //           <a href="?type=password" className="rw-link">
  //             username and password
  //           </a>
  //         </div>
  //       )
  //     }
  //   } else {
  //     return (
  //       <div className="rw-login-link">
  //         <span>Don&apos;t have an account?</span>{' '}
  //         <Link to={routes.signup()} className="rw-link">
  //           Sign up!
  //         </Link>
  //       </div>
  //     )
  //   }
  // }

  // if (loading) {
  //   return null
  // }

  // return (
  //   <>
  //     <MetaTags title="Login" />

  //     <main className="rw-main">
  //       <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
  //       <div className="rw-scaffold rw-login-container">
  //         <div className="rw-segment">
  //           <header className="rw-segment-header">
  //             <h2 className="rw-heading rw-heading-secondary">Login</h2>
  //           </header>

  //           <div className="rw-segment-main">
  //             <div className="rw-form-wrapper">{formToRender()}</div>
  //           </div>
  //         </div>
  //         {linkToRender()}
  //       </div>
  //     </main>
  //   </>
  // )
  const { logIn } = useAuth()
  const [error, setError] = React.useState(null)

  const onSubmit = async (data) => {
    setError(null)
    try {
      const response = await logIn({ email: data.email, password: data.password })
      response?.error?.message ? setError(response.error.message) : navigate(routes.home())
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
      <h1>Sign In</h1>
      <Form onSubmit={onSubmit}>
        {error && <p>{error}</p>}
        <TextField name="email" placeholder="email" />
        <PasswordField name="password" placeholder="password" />
        <Submit>Sign In</Submit>
      </Form>
    </>
  )
}

export default LoginPage
