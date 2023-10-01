import { useRef, useEffect, useState } from "react";
import {
  Form,
  Label,
  PasswordField,
  FieldError,
  Submit,
  EmailField,
  CheckboxField,
} from "@redwoodjs/forms";
import { Link, RouteFocus, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";
import { InputOutlined } from "src/components/Util/Input/Input";

type FormSignupPage = NonNullable<{
  email: string;
  password: string;
  terms: boolean;
}>;
const SignupPage = () => {
  const { isAuthenticated, signUp, client } = useAuth();
  const onSubmit = async (data: FormSignupPage) => {
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
    <article className="text-gray-600 dark:text-white">
      <MetaTags title="Signup, the place to start your journey into ArkDashboard" />
      <header className="mt-4 text-center">
        <h2 className="rw-heading-secondary text-lg font-semibold">Signup</h2>
      </header>
      <div className="mx-auto mt-4 grid max-w-xl grid-cols-1 border border-zinc-500 transition-colors dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 sm:grid-cols-3 sm:rounded">
        <Form<FormSignupPage>
          onSubmit={onSubmit}
          className="order-2 col-span-2 flex w-full flex-col items-center justify-center p-12 sm:order-1 sm:rounded-l"
        >
          <RouteFocus>
            <InputOutlined
              name="email"
              label="Email"
              icon={
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              }
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
          </RouteFocus>

          <InputOutlined
            margin="normal"
            name="password"
            label="Password"
            validation={{
              required: {
                value: true,
                message: "Password is required",
              },
            }}
          />

          <div className="mt-3 inline-flex space-x-2">
            <Label
              name="terms"
              className="rw-label m-0"
              errorClassName="rw-label m-0 rw-label-error"
            >
              I agree with the{" "}
              <Link to={routes.terms()} className="rw-link">
                terms and conditions
              </Link>
            </Label>
            <CheckboxField
              name="terms"
              className="rw-input"
              validation={{
                required: {
                  value: true,
                  message: "You must agree to the terms and conditions",
                },
              }}
            />
          </div>
          <FieldError name="terms" className="rw-field-error" />

          <Submit className="rw-button rw-button-blue my-3">Sign Up</Submit>

          <div className="space-x-2 text-sm text-gray-300 dark:text-stone-300">
            <span>Already have an account?</span>
            <Link to={routes.signin()} className="rw-link">
              Log in!
            </Link>
          </div>
        </Form>
        <div className="order-1 max-h-40 w-full sm:max-h-full">
          <img
            src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/thumbnail2.webp"
            className="h-full w-full object-cover sm:order-2 sm:rounded-r"
          />
        </div>
      </div>
    </article>
  );
};

export default SignupPage;
