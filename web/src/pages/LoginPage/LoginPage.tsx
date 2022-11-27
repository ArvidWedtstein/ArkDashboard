import { useRef, useState } from "react";
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
import { supabaseClient } from "src/App";

const WELCOME_MESSAGE = "Welcome back!";
const REDIRECT = routes.home();

const LoginPage = ({ type }) => {
  const { isAuthenticated, client, loading, logIn } = useAuth();

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
        toast.error(response.error);
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
        autoFocus
        validation={{
          required: {
            value: true,
            message: "Email is required",
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
            message: "Password is required",
          },
        }}
      />

      <div className="rw-forgot-link">
        <Link to={routes.forgotPassword()} className="rw-forgot-link">
          Forgot Password?
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
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Login</h2>
            </header>

            <div className="rw-segment-main">
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

export default LoginPage;
