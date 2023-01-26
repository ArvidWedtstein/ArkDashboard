import {
  Form,
  FormError,
  FieldError,
  Label,
  DatetimeLocalField,
  TextField,
  RadioField,
  Submit,
} from '@redwoodjs/forms'

import type { EditProfileById, UpdateProfileInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import Avatar from 'src/components/Avatar/Avatar'



const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}


type FormProfile = NonNullable<EditProfileById['profile']>

interface ProfileFormProps {
  profile?: EditProfileById['profile']
  onSave: (data: UpdateProfileInput, id?: FormProfile['id']) => void
  error: RWGqlError
  loading: boolean
}

const ProfileForm = (props: ProfileFormProps) => {
  const onSubmit = (data: FormProfile) => {

    props.onSave(data, props?.profile?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormProfile> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

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
            <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white dark:bg-gray-800 dark:text-white shadow-xl">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                    <div className="relative">
                      <Avatar
                        className="absolute -mt-20 h-auto rounded-full border-none align-middle shadow-xl"
                        url={props?.profile?.avatar_url}
                        size={200}
                        onUpload={(url) => {
                          // setAvatarUrl(url);
                          // updateProfile({
                          //   username,
                          //   website,
                          //   avatar_url: url,
                          //   firstname,
                          //   lastname,
                          //   biography,
                          // });
                        }}
                      />
                    </div>
                  </div>
                  {/* <span className="nowrap" title="Simulated button" style="padding:.2em 1em; font-weight:bold; border:1px solid; border-color:#70CDDF; border-width:1px; background:linear-gradient(to bottom, #3c90a8 0%, #105c76 100%); text-shadow: 1px 1px #004d62; color:#70CDDF">UI ITEM SLOT SCALE</span> */}
                  <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                    <div className="mt-32 py-6 px-3 sm:mt-0">
                      <Submit
                        className="mb-1 rounded bg-blue-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-blue-600 sm:mr-2"
                        disabled={props.loading}
                      >
                        {props.loading ? "Loading ..." : "Save"}
                      </Submit>
                    </div>
                  </div>
                  <div className="w-full px-4 lg:order-1 lg:w-4/12">
                    <div className="flex justify-center py-4 pt-8 lg:pt-4">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-gray-600 dark:text-white block text-xl font-bold uppercase tracking-wide">
                          0
                        </span>
                        <span className="text-gray-400 text-sm">Friends</span>
                      </div>
                      <div className="mr-4 p-3 text-center">
                        <span className="text-gray-600 dark:text-white  block text-xl font-bold uppercase tracking-wide">
                          0
                        </span>
                        <span className="text-gray-400 text-sm">
                          Basespots
                        </span>
                      </div>
                      <div className="p-3 text-center lg:mr-4">
                        <span className="text-gray-600 dark:text-white block text-xl font-bold uppercase tracking-wide">
                          {/* {tribescreated} */}0
                        </span>
                        <span className="text-gray-400 text-sm">Tribes</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <form className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <Label
                          name="full_name"
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          errorClassName="rw-label rw-label-error"
                          htmlFor="grid-full-name"
                        >
                          Full name
                        </Label>

                        <TextField
                          name="full_name"
                          defaultValue={props.profile?.full_name}
                          className="rw-input w-full"
                          errorClassName="rw-input rw-input-error"
                          id="grid-full-name"
                        />

                        <FieldError name="full_name" className="rw-field-error" />
                      </div>
                    </div>
                    {/* <Label
                      name="role_id"
                      className="rw-label"
                      errorClassName="rw-label rw-label-error"
                    >
                      Role id
                    </Label>

                    <TextField
                      name="role_id"
                      defaultValue={props.profile?.role_id}
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
                      validation={{ required: true }}
                    />


                    <FieldError name="role_id" className="rw-field-error" /> */}
                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <Label
                          name="biography"
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-bio"
                          errorClassName="rw-label rw-label-error"
                        >
                          Biography
                        </Label>

                        <TextField
                          name="biography"
                          defaultValue={props.profile?.biography}
                          // className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          className='rw-input w-full'
                          id="grid-bio"
                          errorClassName="rw-input rw-input-error"
                        />

                        <FieldError name="biography" className="rw-field-error" />
                        <p className="text-gray-600 text-xs italic">Write whatever nonsense you'd like</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <Label
                          name="website"
                          htmlFor="grid-website"
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          errorClassName="rw-label rw-label-error"
                        >
                          Website
                        </Label>

                        <TextField
                          name="website"
                          defaultValue={props.profile?.website}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-website"
                          errorClassName="rw-input rw-input-error"
                        />

                        <FieldError name="website" className="rw-field-error" />
                      </div>
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <Label
                          name="username"
                          htmlFor="grid-username"
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          errorClassName="rw-label rw-label-error"
                        >
                          Username
                        </Label>
                        <TextField
                          name="username"
                          defaultValue={props.profile?.username}
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-username"
                          errorClassName="rw-input rw-input-error"
                        />

                        <FieldError name="username" className="rw-field-error" />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Form>
    </div>
  )
}

export default ProfileForm
