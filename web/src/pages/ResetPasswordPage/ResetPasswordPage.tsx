import { useEffect, useState } from "react";

import {
  Form,
  Label,
  PasswordField,
  Submit,
  FieldError,
  TextField,
  InputField,
  FormError,
} from "@redwoodjs/forms";
import { navigate, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";

type FormResetPassword = NonNullable<{
  old_password?: string;
  new_password: string;
  repeat_password: string;
}>;
const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { isAuthenticated, client } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: FormResetPassword) => {
    const response = await client.auth.updateUser({
      password: data.new_password,
    });

    if (response?.error) return toast.error(response?.error.message);

    toast.success("Password changed!");
    await client.auth.refreshSession();
    navigate(routes.login());
  };

  return (
    <>
      <MetaTags title="Reset Password" />

      <div className="flex w-full flex-col items-center justify-center p-16">
        <div className="rw-segment flex w-full flex-col items-center justify-center">
          <header className="rw-segment-header text-center">
            <h2 className="rw-heading rw-heading-secondary">Reset Password</h2>
          </header>

          <Form<FormResetPassword>
            onSubmit={onSubmit}
            config={{
              mode: "onBlur",
            }}
            className="rw-form-wrapper rw-segment-main space-y-3 text-center"
          >
            <FormError
              wrapperClassName="rw-form-error-wrapper"
              titleClassName="rw-form-error-title"
              listClassName="rw-form-error-list"
            />
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <PasswordField
                name="new_password"
                className="rw-float-input peer w-60"
                errorClassName="rw-float-input rw-input-error"
                validation={{
                  required: true,
                  pattern: {
                    value: /[^\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu,
                    message: "Please enter a valid password",
                  },
                }}
                autoComplete="nope"
                placeholder=" "
              />
              <Label
                name="new_password"
                className="rw-float-label"
                errorClassName="rw-float-label rw-label-error"
              >
                Enter New Password
              </Label>

              <FieldError name="new_password" className="rw-field-error" />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <PasswordField
                name="repeat_password"
                className="rw-float-input peer w-60"
                errorClassName="rw-float-input rw-input-error"
                validation={{
                  required: true,
                  pattern: {
                    value: /[^\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu,
                    message: "Please enter a valid password",
                  },
                  validate: (_, value) =>
                    value.repeat_password === value.new_password ||
                    "The passwords do not match",
                }}
                autoComplete="nope"
                placeholder=" "
              />
              <Label
                name="repeat_password"
                className="rw-float-label"
                errorClassName="rw-float-label rw-label-error"
              >
                Repeat Password
              </Label>

              <FieldError name="repeat_password" className="rw-field-error" />
            </div>

            <Submit className="rw-button rw-button-blue my-3">Submit</Submit>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
