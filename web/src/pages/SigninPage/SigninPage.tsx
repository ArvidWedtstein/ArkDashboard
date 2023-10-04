import { useEffect } from "react";
import {
  Form,
  Label,
  PasswordField,
  Submit,
  FieldError,
  EmailField,
} from "@redwoodjs/forms";
import { Link, navigate, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { RouteFocus } from "@redwoodjs/router";
import { useAuth } from "src/auth";
import { InputOutlined } from "src/components/Util/Input/Input";

type FormSigninPage = NonNullable<{
  email: string;
  password: string;
}>;

const SigninPage = () => {
  const { isAuthenticated, loading, logIn } = useAuth();
  // const captcha = React.useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      // navigate(routes.home());
    }
  }, [isAuthenticated]);

  if (loading) {
    return null;
  }

  const onSubmit = async (data: FormSigninPage) => {
    try {
      const response = await logIn({
        // provider: "discord",
        authMethod: "password",
        ...data,
        // options: {
        //   redirectTo: window.history.back(),
        // },
      });

      if (response?.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Welcome back!");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <article className="text-gray-600 dark:text-white sm:p-8 p-2">
      <MetaTags title="Login" />
      <header className="mt-4 text-center">
        <h2 className="rw-heading-secondary text-lg font-semibold">Signin</h2>
      </header>
      <div className="mx-auto mt-4 grid max-w-xl grid-cols-1 border border-zinc-500 transition-colors dark:border-zinc-700 dark:bg-gradient-to-tr dark:from-zinc-800 dark:to-zinc-900 sm:grid-cols-3 sm:rounded">
        <Form<FormSigninPage>
          onSubmit={onSubmit}
          className="order-2 col-span-2 flex w-full flex-col items-center justify-center p-12 sm:order-1 sm:rounded-l"
        >
          <RouteFocus>
            <InputOutlined
              name="email"
              label="Email"
              type="email"
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
            />
          </RouteFocus>

          <InputOutlined
            name="password"
            label="Password"
            type="password"
            margin="normal"
            autoComplete="current-password"
            validation={{
              required: {
                value: true,
                message: "Password is required",
              },
            }}
          />

          <div className="rw-link mt-1">
            <Link to={routes.forgotPassword()} className="rw-forgot-link">
              Forgot da Password?
            </Link>
          </div>

          <Submit className="rw-button rw-button-blue my-3">Login</Submit>

          <div className="space-x-2 text-sm text-gray-300 dark:text-stone-300">
            <span>Don&apos;t have an account?</span>
            <Link to={routes.signup()} className="rw-link">
              Sign up!
            </Link>
          </div>
        </Form>
        <div className="order-1 max-h-40 w-full sm:order-2 sm:max-h-full">
          <img
            src="https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/thumbnail3.webp"
            className="h-full w-full object-cover sm:rounded-r"
          />
        </div>
      </div>
    </article>
  );
};

export default SigninPage;
