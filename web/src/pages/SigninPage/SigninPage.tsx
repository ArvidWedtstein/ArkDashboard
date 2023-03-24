import { useEffect } from "react";
import { useAuth } from "@redwoodjs/auth";
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
  EmailField,
} from "@redwoodjs/forms";
import { Link, navigate, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast, Toaster } from "@redwoodjs/web/toast";
import { RouteFocus } from "@redwoodjs/router";

const WELCOME_MESSAGE = "Welcome back!";
const REDIRECT = routes.home();

const SigninPage = () => {
  const { isAuthenticated, loading, logIn } = useAuth();

  // should redirect right after login or wait to show the client prompts?
  useEffect(() => {
    if (isAuthenticated) {
      navigate(REDIRECT);
    }
  }, [isAuthenticated]);

  if (loading) {
    return null;
  }

  const onSubmit = async (data) => {
    try {
      const response = await logIn({
        // provider: "discord",
        ...data,
      });

      if (response?.error) {
        toast.error(response);
      } else {
        toast.success(WELCOME_MESSAGE);
        navigate(REDIRECT);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const PasswordForm = () => (
    <Form onSubmit={onSubmit} className="rw-form-wrapper">
      <Label
        name="email"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Email
      </Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex h-full items-center pl-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
          </svg>
        </div>
        <RouteFocus>
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
              },
            }}
          />
        </RouteFocus>
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
            message: "Password is required",
          },
        }}
      />
      <div className="rw-forgot-link">
        <Link to={routes.forgotPassword()} className="rw-forgot-link">
          Forgot da Password?
        </Link>
      </div>
      <FieldError name="password" className="rw-field-error" />
      <div className="rw-button-group">
        <Submit className="rw-button rw-button-blue">Login</Submit>
      </div>
    </Form>
  );

  return (
    <>
      <MetaTags title="Login" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: "rw-toast", duration: 6000 }} />
        <div className="my-4 mx-auto max-w-lg text-gray-600 dark:text-white">
          <div className="w-full">
            <header className="w-100 p-2 text-center">
              <h2 className="text-lg font-semibold">Login</h2>
            </header>

            <div className="p-2">
              <div className="rw-form-wrapper">{PasswordForm()}</div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Don&apos;t have an account?</span>{" "}
            <Link to={routes.signup()} className="rw-link">
              Sign up!
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default SigninPage;
