import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  TextAreaField,
  UrlField,
} from "@redwoodjs/forms";

import type {
  EditProfileById,
  UpdateProfileInput,
  permission,
} from "types/graphql";
import type { RWGqlError } from "@redwoodjs/forms";
import Avatar from "src/components/Util/Avatar/Avatar";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import { useAuth } from "src/auth";

type FormProfile = NonNullable<EditProfileById["profile"]>;

interface ProfileFormProps {
  profile?: EditProfileById["profile"];
  roles?: EditProfileById["roles"];
  onSave: (data: UpdateProfileInput, id?: FormProfile["id"]) => void;
  error: RWGqlError;
  loading: boolean;
}

const ProfileForm = (props: ProfileFormProps) => {
  const { currentUser } = useAuth();
  const onSubmit = (data: FormProfile) => {
    if (
      currentUser &&
      currentUser.permissions.some((p: permission) =>
        p == props?.profile?.id ? "user_update" : "user_create"
      )
    ) {
      props.onSave(data, props?.profile?.id);
    }
  };
  return (
    <div className="">
      <section className="relative h-[200px]">
        <div
          className="absolute top-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://c4.wallpaperflare.com/wallpaper/506/22/433/ark-ark-survival-evolved-cherry-blossom-video-games-wallpaper-preview.jpg')",
          }}
        >
          <span
            id="blackOverlay"
            className="absolute left-0 h-full w-full bg-black opacity-50"
          ></span>
        </div>
      </section>
      <section className="relative -mt-32 py-16">
        <div className="container-fluid mx-auto px-4">
          <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl dark:bg-zinc-500">
            <Form<FormProfile> onSubmit={onSubmit} error={props.error}>
              <FormError
                error={props.error}
                wrapperClassName="rw-form-error-wrapper"
                titleClassName="rw-form-error-title"
                listClassName="rw-form-error-list"
              />
              <div className="flex flex-wrap justify-center">
                <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                  <div className="relative">
                    <Avatar
                      className="absolute -mt-20 aspect-square h-auto rounded-full border-none align-middle shadow-xl"
                      url={props.profile.avatar_url}
                      size={200}
                      editable={true}

                    />
                  </div>
                </div>

                <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                  <div className="mt-32 py-6 px-3 sm:mt-0">
                    <Submit
                      className="rw-button rw-button-blue uppercase"
                      disabled={props.loading}
                    >
                      {props.loading ? "Loading ..." : "Save"}
                    </Submit>
                  </div>
                </div>
                <div className="w-full px-4 lg:order-1 lg:w-4/12">
                  <div className="flex justify-center py-4 pt-8 lg:pt-4">
                    <div className="mr-4 p-3 text-center">
                      <span className="block text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-stone-100">
                        0
                      </span>
                      <span className="text-sm text-gray-600 dark:text-stone-300">
                        Friends
                      </span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="block text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-stone-100">
                        {(
                          new Date().getFullYear() -
                          new Date(props.profile.created_at).getFullYear() +
                          (new Date().getMonth() -
                            new Date(props.profile.created_at).getMonth()) /
                          12
                        ).toPrecision(1)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-stone-300">
                        Years Active
                      </span>
                    </div>
                    <div className="p-3 text-center lg:mr-4">
                      <span className="block text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-stone-100">
                        {/* {tribescreated} */}0
                      </span>
                      <span className="text-sm text-gray-600 dark:text-stone-300">
                        Tribes
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-6 flex w-full flex-col flex-wrap justify-center text-center text-gray-800 dark:text-stone-100">
                <div className="flex flex-col items-center justify-center">
                  <Label
                    name="full_name"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Full Name
                  </Label>

                  <TextField
                    name="full_name"
                    defaultValue={props.profile?.full_name}
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />

                  <FieldError name="full_name" className="rw-field-error" />
                </div>

                <div className="flex flex-col items-center justify-center">
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="none"
                        fill="currentColor"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        viewBox="0 0 512 512"
                      >
                        <path d="M259.7 16.03C116.5 13.94 2.766 140.5 17.25 283.1c11.96 117.8 102.2 205.2 221.5 212.8c9.275 .5957 17.18-6.739 17.18-16.04c0-8.395-6.552-15.39-14.92-15.92c-106.1-6.828-185.7-86.38-192.7-192.5c-7.852-119.6 82.95-220.8 202.6-223.4c118.1-2.607 212.1 89.77 212.1 208.2V278.7c0 26.43-17.55 50.57-43.34 56.27c-36.37 8.039-68.67-19.59-68.67-54.64v-120.1c0-8.846-7.168-16.02-16.01-16.02c-8.838 0-16.02 7.165-16.02 16.01v17.88c-24.95-25.56-61.83-39.39-101.6-31.85C173.5 154.7 137.8 190.7 129.8 235.6c-12.72 70.86 41.68 132.8 110.2 132.8c37.39 0 70.32-18.63 90.68-46.9c16.48 30.84 50.34 51.03 88.7 46.15c44.44-5.656 76.63-45.58 76.63-90.42V256.3C495.1 122.8 392.5 17.96 259.7 16.03zM239.9 336.3c-44.13 0-80.02-35.93-80.02-80.09S195.8 176.2 239.9 176.2s80.02 35.93 80.02 80.09S284.1 336.3 239.9 336.3z" />
                      </svg>
                    </div>
                    <TextField
                      name="username"
                      defaultValue={props.profile?.username}
                      className="rw-input pl-10"
                      errorClassName="rw-input rw-input-error"
                    />
                  </div>

                  <FieldError name="username" className="rw-field-error" />
                </div>

                <div className="flex flex-col items-center justify-center">
                  <Label
                    name="steam_user_id"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Steam ID
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                      >
                        <path d="M395.5 177.5c0 33.8-27.5 61-61 61-33.8 0-61-27.3-61-61s27.3-61 61-61c33.5 0 61 27.2 61 61zm52.5.2c0 63-51 113.8-113.7 113.8L225 371.3c-4 43-40.5 76.8-84.5 76.8-40.5 0-74.7-28.8-83-67L0 358V250.7L97.2 290c15.1-9.2 32.2-13.3 52-11.5l71-101.7c.5-62.3 51.5-112.8 114-112.8C397 64 448 115 448 177.7zM203 363c0-34.7-27.8-62.5-62.5-62.5-4.5 0-9 .5-13.5 1.5l26 10.5c25.5 10.2 38 39 27.7 64.5-10.2 25.5-39.2 38-64.7 27.5-10.2-4-20.5-8.3-30.7-12.2 10.5 19.7 31.2 33.2 55.2 33.2 34.7 0 62.5-27.8 62.5-62.5zm207.5-185.3c0-42-34.3-76.2-76.2-76.2-42.3 0-76.5 34.2-76.5 76.2 0 42.2 34.3 76.2 76.5 76.2 41.9.1 76.2-33.9 76.2-76.2z" />
                      </svg>
                    </div>
                    <TextField
                      name="steam_user_id"
                      defaultValue={props.profile?.steam_user_id}
                      className="rw-input pl-10"
                      errorClassName="rw-input rw-input-error"
                    />
                  </div>

                  <FieldError name="steam_user_id" className="rw-field-error" />
                </div>

                <hr className="my-6 border-gray-600 dark:border-stone-300" />

                <div className="flex flex-col items-center justify-center">
                  <Label
                    name="biography"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Biography
                  </Label>

                  <TextAreaField
                    name="biography"
                    defaultValue={props.profile?.biography}
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                  />

                  <FieldError name="biography" className="rw-field-error" />
                </div>

                <div className="flex flex-col items-center justify-center">
                  <Label
                    name="website"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Website
                  </Label>

                  <UrlField
                    name="website"
                    defaultValue={props.profile?.website}
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    placeholder="https://www.example.com"
                  />

                  <FieldError name="website" className="rw-field-error" />
                </div>

                {currentUser.permissions.some((p: permission) =>
                  p.includes("user_update")
                ) && (
                    <div className="flex flex-col items-center justify-center">
                      <Label
                        name="role_id"
                        className="rw-label"
                        errorClassName="rw-label rw-label-error"
                      >
                        Role
                      </Label>

                      <Lookup
                        name="role_id"
                        defaultValue={[props.profile?.role_id.toString()]}
                        options={
                          props?.roles.map((r) => ({
                            label: r.name,
                            value: r.id,
                          })) || []
                        }
                      />

                      <FieldError name="role_id" className="rw-field-error" />
                    </div>
                  )}
              </div>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileForm;
