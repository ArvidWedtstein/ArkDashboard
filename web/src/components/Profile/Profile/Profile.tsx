import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";
import Avatar from "src/components/Util/Avatar/Avatar";
import Tabs from "src/components/Util/Tabs/Tabs";

import { combineBySummingKeys, groupBy } from "src/lib/formatters";

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
  const { currentUser, isAuthenticated } = useAuth();
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
    <article className="">
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
          <div className="relative mb-5 flex w-full min-w-0 flex-col break-words rounded-lg bg-stone-100 px-6 shadow-xl dark:bg-zinc-600">
            <div className="flex flex-wrap justify-center">
              <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                <div className="relative">
                  <Avatar
                    className="absolute -mt-20 aspect-square h-auto rounded-full border-none align-middle shadow-xl"
                    url={profile.avatar_url}
                    size={160}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                <div className="mt-32 py-6 px-3 sm:mt-0"></div>
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
                        new Date(profile.created_at).getFullYear() +
                        (new Date().getMonth() -
                          new Date(profile.created_at).getMonth()) /
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

            <div className="my-6 flex w-full flex-col flex-wrap text-center text-gray-800 dark:text-stone-100">
              <div>
                <p className="text-xl font-medium tracking-wide">
                  {profile.full_name}
                </p>
                <p className="text-sm tracking-wide">@{profile.username}</p>
              </div>

              <hr className="my-6 border-gray-600 dark:border-stone-300" />
              <div className="">
                <p className="mb-2 block text-xs font-bold uppercase tracking-wide ">
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
            <Tabs
              type="center"
              tabs={[
                {
                  title: "Permissions",
                  content: (
                    <div
                      id="detailed-pricing"
                      className="my-3 w-full overflow-x-auto rounded-lg border border-zinc-500 text-left"
                    >
                      <div className="min-w-max overflow-hidden">
                        <div className="grid grid-cols-4 gap-x-16 rounded-t-lg bg-gray-100 p-4 text-sm font-medium text-gray-900 dark:bg-zinc-700 dark:text-white">
                          <div className="flex items-center">Permissions</div>
                          <div>Create</div>
                          <div>Update</div>
                          <div>Delete</div>
                        </div>
                        {Object.entries(
                          groupBy(
                            Object.entries(
                              combineBySummingKeys(
                                {
                                  basespot_create: false,
                                  basespot_update: false,
                                  basespot_delete: false,
                                  user_create: false,
                                  user_update: false,
                                  user_delete: false,
                                  timeline_create: false,
                                  timeline_update: false,
                                  timeline_delete: false,
                                  gamedata_create: false,
                                  gamedata_update: false,
                                  gamedata_delete: false,
                                  tribe_create: false,
                                  tribe_update: false,
                                  tribe_delete: false,
                                  role_create: false,
                                  role_update: false,
                                  role_delete: false,
                                },
                                profile.role_profile_role_idTorole.permissions.reduce(
                                  (a, v) => ({ ...a, [v]: true }),
                                  {}
                                )
                              )
                            ).map(([p, v]) => ({
                              perm: p,
                              for: p.split("_")[0],
                              type: p.split("_")[1],
                              hasPermission: v,
                            })),
                            "for"
                          )
                        ).map(([type, perms], i) => (
                          <div
                            key={`${type}-row-${i}`}
                            className="grid grid-cols-4 gap-x-16 border-b border-gray-200 px-4 py-5 text-sm text-zinc-700 dark:border-zinc-500"
                          >
                            <div className="capitalize text-gray-500 dark:text-gray-400">
                              {type}
                            </div>
                            {perms
                              .sort(
                                (a, b) =>
                                  [
                                    "create",
                                    "update",
                                    "delete",
                                    "read",
                                  ].indexOf(a.type) -
                                  [
                                    "create",
                                    "update",
                                    "delete",
                                    "read",
                                  ].indexOf(b.type)
                              )
                              .map((perm) => (
                                <div key={`${type}-${i}-${perm.perm}`}>
                                  {perm.hasPermission ? (
                                    <svg
                                      className="h-5 w-5 text-green-500"
                                      aria-hidden="true"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      className="h-5 w-5 text-red-500"
                                      aria-hidden="true"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  )}
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Seasons",
                  content: (
                    <div className="mb-6 grid grid-cols-2 justify-center gap-1 overflow-hidden rounded-lg dark:text-gray-300">
                      {profile.TimelineSeasonPerson.map((season) => (
                        <div className="hover:border-pea-500 w-full rounded-sm border border-transparent bg-zinc-700 p-4 transition ease-in-out">
                          <p>{season.TimelineSeason.tribe_name}</p>
                          <p>
                            {season.TimelineSeason.season ? "S" : ""}
                            {season.TimelineSeason.season}{" "}
                            <span>{season.TimelineSeason.server}</span>
                          </p>
                        </div>
                      ))}
                      {profile.TimelineSeasonPerson.length % 2 === 1 && (
                        <div className="w-full rounded-sm bg-zinc-700 p-4"></div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {currentUser && currentUser.id === profile.id && (
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
          )}
        </div>
      </section>
    </article>
  );
};

export default Profile;
