import { Form, TextField } from "@redwoodjs/forms";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import Avatar from "src/components/Avatar/Avatar";

import { formatEnum, timeTag } from "src/lib/formatters";

import type {
  DeleteProfileMutationVariables,
  FindProfileById,
} from "types/graphql";

const DELETE_PROFILE_MUTATION = gql`
  mutation DeleteProfileMutation($id: String!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

interface Props {
  profile: NonNullable<FindProfileById["profile"]>;
}

const Profile = ({ profile }: Props) => {
  const [deleteProfile] = useMutation(DELETE_PROFILE_MUTATION, {
    onCompleted: () => {
      toast.success("Profile deleted");
      navigate(routes.profiles());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteProfileMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete profile " + id + "?")) {
      deleteProfile({ variables: { id } });
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
        <div className="container-fluid px-4">
          <div className="relative mb-5 flex w-full min-w-0 flex-col break-words rounded-lg dark:bg-zinc-600 bg-stone-100 shadow-xl px-6">
            <div className="flex flex-wrap justify-center">
              <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                <div className="relative">
                  <Avatar
                    className="absolute -mt-20 h-auto rounded-full border-none align-middle shadow-xl"
                    url={profile.avatar_url}
                    size={200}
                    editable={false}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                <div className="mt-32 py-6 px-3 sm:mt-0">

                </div>
              </div>
              <div className="w-full px-4 lg:order-1 lg:w-4/12">
                <div className="flex justify-center py-4 pt-8 lg:pt-4">
                  <div className="mr-4 p-3 text-center">
                    <span className="text-gray-800 dark:text-stone-100 block text-xl font-bold uppercase tracking-wide">
                      0
                    </span>
                    <span className="text-sm text-gray-600 dark:text-stone-300">
                      Friends
                    </span>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-gray-800 dark:text-stone-100 block text-xl font-bold uppercase tracking-wide">
                      {(new Date().getFullYear() - new Date(profile.created_at).getFullYear() + (new Date().getMonth() - new Date(profile.created_at).getMonth()) / 12).toPrecision(1)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-stone-300">
                      Years Active
                    </span>
                  </div>
                  <div className="p-3 text-center lg:mr-4">
                    <span className="text-gray-800 dark:text-stone-100 block text-xl font-bold uppercase tracking-wide">
                      {/* {tribescreated} */}0
                    </span>
                    <span className="text-gray-600 text-sm dark:text-stone-300">
                      Tribes
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full my-6 text-center flex flex-wrap flex-col text-gray-800 dark:text-stone-100">
              <div>
                <p className="tracking-wide text-xl font-medium">
                  {profile.full_name}
                </p>
                <p className="tracking-wide text-sm">@{profile.username}</p>
                <span className="text-base font-normal">{profile.role_profile_role_idTorole.name}</span>
              </div>

              <hr className="my-6 border-gray-600 dark:border-stone-300" />
              <div className="">
                <p
                  className="mb-2 block text-xs font-bold uppercase tracking-wide "
                >
                  Biography
                </p>

                <span className="">{profile.biography}</span>
              </div>

              <div className="mt-6">
                <p className="mb-2 block text-xs font-bold uppercase tracking-wide">
                  Website
                </p>
                <span className="">{profile.website}</span>
              </div>
            </div>
          </div>


          <div className="w-full flex flex-row dark:text-stone-100 gap-5">
            {profile.UserRecipe.map(({ id, created_at, private: IsPrivate, UserRecipeItemRecipe }) => (
              <div className="p-4 bg-zinc-700 rounded-lg shadow w-1/3" key={id}>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-1 w-12 h-12 rounded bg-white hover:shadow" title={`Private: ${IsPrivate}`}>
                    {IsPrivate ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-full h-full">
                        <path d="M384 223.1l-32 0V127.1c0-70.59-57.41-127.1-128-127.1S96 57.41 96 127.1v95.1L64 223.1c-35.35 0-64 28.65-64 64v160c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64v-160C448 252.7 419.3 223.1 384 223.1zM128 128c0-52.94 43.06-96 96-96s96 43.06 96 96v96H128V128zM416 448c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V288c0-17.64 14.36-32 32-32h320c17.64 0 32 14.36 32 32V448zM224 319.1c-8.844 0-16 7.156-16 16v64c0 8.844 7.156 15.1 16 15.1S240 408.8 240 400v-64C240 327.2 232.8 319.1 224 319.1z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-full h-full">
                        <path d="M448 0c-70.59 0-128 57.41-128 128v96H64C28.65 224 0 252.7 0 288v160c0 35.35 28.65 64 64 64h320c35.35 0 64-28.65 64-64V288c0-35.35-28.65-64-64-64h-32V128c0-52.94 43.06-96 96-96s96 43.06 96 96v80C544 216.8 551.2 224 560 224S576 216.8 576 208V128C576 57.41 518.6 0 448 0zM384 256c17.64 0 32 14.36 32 32v160c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V288c0-17.64 14.36-32 32-32H384zM224 416c8.844 0 16-7.156 16-16v-64C240 327.2 232.8 320 224 320s-16 7.156-16 16v64C208 408.8 215.2 416 224 416z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold my-1">Your Custom Recipe</h3>
                    <span className="text-stone-300">
                      test
                    </span>
                  </div>
                </div>
                {/* <p className="text-base leading-5">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Qui facere, sequi, rem, consequuntur voluptate quasi iste natus assumenda cupiditate dolorum molestias porro magnam. Voluptatibus cum quo assumenda ut quod dolore.</p> */}
                <p className="text-base leading-5">{JSON.stringify(UserRecipeItemRecipe)}</p>
                <div className="mt-4 inline-block float-right text-xs">
                  <span className="relative inline-block mx-1">{new Date(created_at).toLocaleString("en-GB", {
                    dateStyle: "long",
                  })}</span>*<span className="relative inline-block mx-1">{new Date(created_at).toLocaleString("en-GB", {
                    timeStyle: "short",
                  })}</span>
                </div>
              </div>
            ))}
          </div>

          <nav className="rw-button-group">
            <Link
              to={routes.editProfile({ id: profile.id })}
              className="rw-button rw-button-blue"
            >
              Edit
            </Link>
            <button
              type="button"
              className="rw-button rw-button-red"
              onClick={() => onDeleteClick(profile.id)}
            >
              Delete
            </button>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default Profile;
