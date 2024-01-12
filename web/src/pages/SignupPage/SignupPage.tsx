import { useState } from "react";
import {
  Form,
  Label,
  FieldError,
  CheckboxField,
} from "@redwoodjs/forms";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";
import { Input } from "src/components/Util/Input/Input";
import Button from "src/components/Util/Button/Button";

type FormSignupPage = NonNullable<{
  email: string;
  password: string;
  terms: boolean;
}>;
const SignupPage = () => {
  const { isAuthenticated, signUp, client } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
          <Input
            name="email"
            label="Email"
            InputProps={{
              startAdornment: (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              )
            }}
            autoFocus
            autoComplete="email"
            placeholder="olanordmann@gmail.com"
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

          <Input
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            InputProps={{
              endAdornment: (
                <Button
                  variant="icon"
                  color="DEFAULT"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 fill-current"
                    viewBox="0 0 576 512"
                  >
                    {showPassword ? (
                      <path d="M272.9 137.2l30.91 24.41c5.301-.9102 10.67-1.638 16.23-1.638c50.78 0 92.05 39.74 95.36 89.74l30.82 24.33C447 268.1 448 262.2 448 256.1C448 185.4 390.7 128 320 128C303.3 128 287.5 131.4 272.9 137.2zM320 448c-106.5 0-204.3-71.98-255-187.3C64.58 259.6 64.05 256.9 63.1 256.2c.0547-1.146 .5859-3.783 .7695-4.363c12.84-29.22 28.7-55.61 46.89-78.8l-25.05-19.78c-20.06 25.52-37.34 54.31-51.13 85.71C33.56 243.4 31.1 251 31.1 256c0 4.977 1.562 12.6 3.469 17.03c54.25 123.4 161.6 206.1 284.5 206.1c48.13 0 93.81-12.96 134.9-35.96l-27.74-21.9C393.6 438.7 357.4 448 320 448zM320 64c106.5 0 204.3 71.98 255 187.3c.3945 1.08 .9238 3.713 .9785 4.443c-.0547 1.145-.5859 3.783-.7695 4.361c-12.84 29.22-28.69 55.61-46.88 78.79l25.05 19.78c20.06-25.52 37.33-54.3 51.13-85.7c1.906-4.43 3.469-12.07 3.469-17.03c0-4.977-1.562-12.6-3.469-17.03c-54.25-123.4-161.6-206.1-284.5-206.1c-48.13 0-93.8 12.96-134.9 35.95l27.74 21.9C246.4 73.33 282.6 64 320 64zM320 384c16.68 0 32.56-3.42 47.17-9.229l-30.92-24.41c-5.307 .9121-10.68 1.644-16.25 1.644c-50.8 0-92.09-39.78-95.37-89.76L193.8 237.9C192.1 243.9 192 249.8 192 256C192 326.7 249.3 384 320 384zM633.9 483.4L25.9 3.42C18.1-2.033 8.936-.8301 3.436 6.061c-5.469 6.938-4.281 17 2.656 22.49l608 480C617 510.9 620.5 512 624 512c4.719 0 9.406-2.094 12.56-6.078C642 498.1 640.8 488.9 633.9 483.4z" />
                    ) : (
                      <path d="M288 128C217.3 128 160 185.3 160 256s57.33 128 128 128c70.64 0 128-57.32 128-127.9C416 185.4 358.7 128 288 128zM288 352c-52.93 0-96-43.06-96-96s43.07-96 96-96c52.94 0 96 43.02 96 96.01C384 308.9 340.1 352 288 352zM572.5 238.1C518.3 115.5 410.9 32 288 32S57.69 115.6 3.469 238.1C1.563 243.4 0 251 0 256c0 4.977 1.562 12.6 3.469 17.03C57.72 396.5 165.1 480 288 480s230.3-83.58 284.5-206.1C574.4 268.6 576 260.1 576 256C576 251 574.4 243.4 572.5 238.1zM543.2 260.2C492.3 376 394.5 448 288 448c-106.5 0-204.3-71.98-255-187.3C32.58 259.6 32.05 256.9 31.1 256.2c.0547-1.146 .5859-3.783 .7695-4.363C83.68 135.1 181.5 64 288 64c106.5 0 204.3 71.98 255 187.3c.3945 1.08 .9238 3.713 .9785 4.443C543.9 256.9 543.4 259.6 543.2 260.2z" />
                    )}
                  </svg>
                  <span className="sr-only">
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </Button>
              ),
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

          <Button
            variant="contained"
            color="success"
            type="submit"
          >
            Sign Up
          </Button>

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
