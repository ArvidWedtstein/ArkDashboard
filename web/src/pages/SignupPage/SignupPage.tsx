import { useRef, useEffect, useState } from "react";
import {
  Form,
  Label,
  PasswordField,
  FieldError,
  Submit,
  EmailField,
} from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";

const SignupPage = () => {
  const { isAuthenticated, signUp, client } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        // options: {
        //   data: {
        //     username: data.username,
        //   },
        // },
      });
      if (response?.error) {
        toast.error(JSON.stringify(response.error));
      } else {
        toast.success("Check your email for the login link!");
        // navigate(routes.home())
      }
    } catch (error) {
      toast.error(error.message);
    }
    return;
  };
  return (
    <>
      <MetaTags title="Signup" />

      <div className="my-4 mx-auto max-w-lg p-4 text-gray-600 dark:text-white">
        <div className="w-full">
          <header className="text-center">
            <h2 className="rw-heading-secondary text-lg font-semibold">
              Signup
            </h2>
          </header>

          <Form
            onSubmit={onSubmit}
            className="rw-form-wrapper my-4 flex flex-col items-center justify-center"
          >
            <Label
              name="email"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Email
            </Label>

            <input name="username" className="hidden" type="hidden" />
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
              <EmailField
                name="email"
                className="rw-input pl-10"
                errorClassName="rw-input rw-input-error"
                placeholder="ola@nordmann.com"
                autoFocus
                autoComplete="email"
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
            <FieldError name="password" className="rw-field-error" />

            {/* TODO: add terms  */}
            {/* <Label
              name="terms"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
            </Label>
            <CheckboxField name="terms" className="rw-input" /> */}

            <Submit className="rw-button rw-button-blue my-3">Sign Up</Submit>

            <div className="space-x-2 text-gray-300 dark:text-stone-300">
              <span>Already have an account?</span>
              <Link to={routes.signin()} className="rw-link">
                Log in!
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
