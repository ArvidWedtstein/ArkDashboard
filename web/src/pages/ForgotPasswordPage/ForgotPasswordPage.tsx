import { useEffect, useRef } from "react";

import { Form, Label, TextField, Submit, FieldError } from "@redwoodjs/forms";
import { navigate, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";

const ForgotPasswordPage = () => {
  const { isAuthenticated, forgotPassword } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef?.current?.focus();
  }, []);

  const onSubmit = async (data: { username: string }) => {
    const response = await forgotPassword(data.username);

    if ((response as any)?.error) {
      toast.error((response as any)?.error);
    } else {
      // The function `forgotPassword.handler` in api/src/functions/auth.js has
      // been invoked, let the user know how to get the link to reset their
      // password (sent in email, perhaps?)
      toast.success(
        "A link to reset your password was sent to " + (response as any)?.email
      );
      navigate(routes.signin());
    }
  };

  return (
    <>
      <MetaTags title="I Forgot Password at home bro" />
      <div className="flex w-full flex-col items-center justify-center">
        <div className="rw-segment flex w-full flex-col items-center justify-center">
          <header className="rw-segment-header text-center">
            <h2 className="rw-heading rw-heading-secondary">Forgot Password</h2>
          </header>

          <h3 className="my-3 max-w-sm text-center text-gray-900 dark:text-stone-300">
            Attention survivor: Your password has escaped and is hiding in the
            jungles of your memory. We'll equip you with the tools to track it
            down!
          </h3>

          <Form
            onSubmit={onSubmit}
            className="rw-form-wrapper rw-segment-main text-center"
          >
            <Label
              name="email"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Your Email plz
            </Label>
            <TextField
              name="email"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              ref={emailRef}
              validation={{
                required: true,
              }}
            />

            <FieldError name="email" className="rw-field-error" />

            <Submit className="rw-button rw-button-blue my-3">Submit</Submit>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
