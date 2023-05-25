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
        <div className="container-fluid mx-auto px-4">
          <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg dark:bg-zinc-500 bg-white shadow-xl">
            <div className="px-6">
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
