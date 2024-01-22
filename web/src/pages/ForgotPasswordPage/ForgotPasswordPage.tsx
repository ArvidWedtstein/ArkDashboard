import { useEffect, useRef } from "react";

import { Form, Label, TextField, Submit, FieldError } from "@redwoodjs/forms";
import { navigate, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";
import Button from "src/components/Util/Button/Button";
import { Input } from "src/components/Util/Input/Input";

type FormForgotPassword = NonNullable<{
  email: string;
}>;
const ForgotPasswordPage = () => {
  const { isAuthenticated, client } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home());
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: FormForgotPassword) => {
    const response = await client.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (response?.error) return toast.error(response?.error.message);

    toast.success(`A link to reset your password was sent to ${data.email}`);
    // navigate(routes.signin());
  };

  return (
    <>
      <MetaTags title="I Forgot Password at home bro" />
      <div className="flex w-full flex-col items-center justify-center p-16">
        <div className="rw-segment flex w-full flex-col items-center justify-center">
          <header className="rw-segment-header text-center">
            <h2 className="rw-heading rw-heading-secondary">Forgot Password</h2>
          </header>

          <h3 className="my-3 max-w-sm text-center text-gray-900 dark:text-stone-300">
            Attention survivor: Your password has escaped and is hiding in the
            jungles of your memory. We'll equip you with the tools to track it
            down!
          </h3>

          <Form<FormForgotPassword>
            onSubmit={onSubmit}
            className="rw-form-wrapper rw-segment-main text-center"
          >
            <div className="relative">
              <Input
                name="email"
                label="Email"
                autoFocus
                autoComplete="email"
                validation={{
                  required: true,
                  pattern: {
                    value: /[^@]+@[^\.]+\..+/,
                    message: "Please enter a valid email address",
                  },
                }}
              />
            </div>

            <Button type="submit" variant="contained" color="success" className="my-3">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
