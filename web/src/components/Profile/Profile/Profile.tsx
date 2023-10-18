import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";
import Avatar from "src/components/Util/Avatar/Avatar";
import Chart, { ChartContainer, LineChart as Linechart2, PieChart, ScatterChart } from "src/components/Util/Chart/Chart";
import Tabs, { Tab } from "src/components/Util/Tabs/Tabs";

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
            <Tabs>
              <Tab label="Permissions">
                <div className="my-3 w-full overflow-x-auto rounded-lg border border-zinc-500 text-left">
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
                        <div className="capitalize text-gray-500 dark:text-zinc-300">
                          {type}
                        </div>
                        {perms
                          .sort(
                            (a, b) =>
                              ["create", "update", "delete", "read"].indexOf(
                                a.type
                              ) -
                              ["create", "update", "delete", "read"].indexOf(
                                b.type
                              )
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
              </Tab>
              <Tab label="Seasons">
                <div className="mb-6 px-4 py-5 dark:text-gray-300">
                  <div className="grid grid-cols-2 justify-center gap-1 overflow-hidden rounded-lg">
                    {profile.TimelineSeasonPerson.map((season) => (
                      <Link
                        to={routes.timelineSeason({
                          id: season.TimelineSeason.id,
                        })}
                        key={`season-${season.TimelineSeason.id}`}
                        className="hover:border-pea-500 w-full rounded-sm border border-transparent bg-zinc-700 p-4 transition ease-in-out first:rounded-tl-lg"
                      >
                        <p>{season.TimelineSeason.tribe_name}</p>
                        <p>
                          {season.TimelineSeason.season ? "S" : ""}
                          {season.TimelineSeason.season}{" "}
                          <span>{season.TimelineSeason.server}</span>
                        </p>
                      </Link>
                    ))}
                    {profile.TimelineSeasonPerson.length % 2 === 1 && (
                      <div className="w-full rounded-sm bg-zinc-700 p-4"></div>
                    )}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>

          <Chart
            labels={["Test", "tert2", "monday"]}
            data={[3, 6, 8, 3]}
            options={{
              verticalLines: true,
              horizontalLines: true,
              horizontalLabels: true,
              verticalLabels: true,
            }}
          />
          <ChartContainer
            height={300}
            xAxis={[
              {
                scaleType: "band",
                label: 'test',
                dataKey: "month",
              },
            ]}
            yAxis={[
              {
                label: "Y Axis",
              }
            ]}
            dataset={[
              {
                london: 24,
                paris: 57,
                newYork: 86,
                seoul: 21,
                month: 'Jan',
              },
              {
                london: 50,
                paris: 52,
                newYork: 78,
                seoul: 28,
                month: 'Feb',
              },
              {
                london: 47,
                paris: 53,
                newYork: 106,
                seoul: 41,
                month: 'Mar',
              },
              {
                london: 54,
                paris: 56,
                newYork: 92,
                seoul: 73,
                month: 'Apr',
              },
              {
                london: 57,
                paris: 69,
                newYork: 92,
                seoul: 99,
                month: 'May',
              },
              {
                london: 60,
                paris: 63,
                newYork: 103,
                seoul: 144,
                month: 'June',
              },
              {
                london: 59,
                paris: 60,
                newYork: 105,
                seoul: 319,
                month: 'July',
              },
              {
                london: 65,
                paris: 60,
                newYork: 106,
                seoul: 249,
                month: 'Aug',
              },
              {
                london: 51,
                paris: 51,
                newYork: 95,
                seoul: 131,
                month: 'Sept',
              },
              {
                london: 60,
                paris: 65,
                newYork: 97,
                seoul: 55,
                month: 'Oct',
              },
              {
                london: 67,
                paris: 64,
                newYork: 76,
                seoul: 48,
                month: 'Nov',
              },
              {
                london: 61,
                paris: 70,
                newYork: 103,
                seoul: 20,
                month: 'Dec',
              },
            ]}
            series={[
              { dataKey: 'london', label: 'London' },
              { dataKey: 'newYork', label: 'New York' },
              { dataKey: 'paris', label: 'Paris' },
              { dataKey: 'seoul', label: 'Seoul' },
            ]}
          />

          <Linechart2
            // xAxis={[{ data: [0, 2.5, 3, 5, 8, 10] }]}
            series={[
              {
                data: [0, 3, 5, 1, 5, 2, 10, 6],
                area: true,
                // showMark: ({ index }) => index % 2 === 0,
              },
            ]}
            width={500}
            height={300}
          />

          <ScatterChart
            width={500}
            height={300}
            series={[
              {
                yAxisKey: 'linearAxis',
                // data: [
                //   { x: 100, y: 200, id: 1 },
                //   { x: 120, y: 100, id: 2 },
                //   { x: 170, y: 300, id: 3 },
                //   { x: 140, y: 250, id: 4 },
                //   { x: 150, y: 400, id: 5 },
                //   { x: 110, y: 280, id: 6 },
                // ],
                data: [1, 10, 30, 50, 70, 90, 100],
                label: 'Linear',
                id: 'pvId'
              },
              {
                yAxisKey: 'logAxis',
                // data: [
                //   { x: 300, y: 300, id: 1 },
                //   { x: 400, y: 500, id: 2 },
                //   { x: 200, y: 700, id: 3 },
                //   { x: 340, y: 350, id: 4 },
                //   { x: 560, y: 500, id: 5 },
                //   { x: 230, y: 780, id: 6 },
                //   { x: 500, y: 400, id: 7 },
                //   { x: 300, y: 500, id: 8 },
                //   { x: 240, y: 300, id: 9 },
                //   { x: 320, y: 550, id: 10 },
                //   { x: 500, y: 400, id: 11 },
                //   { x: 420, y: 280, id: 12 },
                // ],
                data: [1, 10, 30, 50, 70, 90, 100],
                label: 'Log',
                id: 'serie2'
              }
            ]}
            xAxis={[{ data: [1, 10, 30, 50, 70, 90, 100] }]}
            yAxis={[
              { id: 'linearAxis', label: 'Linear', scaleType: 'linear' },
              { id: 'logAxis', label: 'Log', scaleType: 'log' },
            ]}
            leftAxis="linearAxis"
            rightAxis="logAxis"
            type="line"
          />

          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 25, label: 'series A' },
                  { id: 1, value: 6, label: 'series B' },
                  { id: 2, value: 3, label: 'series C' },
                ],
                paddingAngle: 5,
                startAngle: -90,
                endAngle: 180,
                innerRadius: 90,
                outerRadius: 100,
                cornerRadius: 5,
              }
            ]}
            width={500}
            height={500}
          />

          {currentUser && currentUser.id === profile.id && (
            <nav className="rw-button-group">
              <Link
                to={routes.editProfile({ id: profile.id })}
                className="rw-button rw-button-blue"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="rw-button-icon-start"
                >
                  <path d="M493.2 56.26l-37.51-37.51C443.2 6.252 426.8 0 410.5 0c-16.38 0-32.76 6.25-45.26 18.75L45.11 338.9c-8.568 8.566-14.53 19.39-17.18 31.21l-27.61 122.8C-1.7 502.1 6.158 512 15.95 512c1.047 0 2.116-.1034 3.198-.3202c0 0 84.61-17.95 122.8-26.93c11.54-2.717 21.87-8.523 30.25-16.9l321.2-321.2C518.3 121.7 518.2 81.26 493.2 56.26zM149.5 445.2c-4.219 4.219-9.252 7.039-14.96 8.383c-24.68 5.811-69.64 15.55-97.46 21.52l22.04-98.01c1.332-5.918 4.303-11.31 8.594-15.6l247.6-247.6l82.76 82.76L149.5 445.2zM470.7 124l-50.03 50.02l-82.76-82.76l49.93-49.93C393.9 35.33 401.9 32 410.5 32s16.58 3.33 22.63 9.375l37.51 37.51C483.1 91.37 483.1 111.6 470.7 124z" />
                </svg>
                Edit
              </Link>
              <button
                type="button"
                className="rw-button rw-button-red"
                onClick={() => onDeleteClick(profile.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="rw-button-icon-start"
                >
                  <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80C168.9 0 154.6 7.125 145.6 19.25L112 64h-96C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16C448 71.2 440.8 64 432 64zM152 64l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zM400 128C391.2 128 384 135.2 384 144v288c0 26.47-21.53 48-48 48h-224C85.53 480 64 458.5 64 432v-288C64 135.2 56.84 128 48 128S32 135.2 32 144v288C32 476.1 67.89 512 112 512h224c44.11 0 80-35.89 80-80v-288C416 135.2 408.8 128 400 128zM144 416V192c0-8.844-7.156-16-16-16S112 183.2 112 192v224c0 8.844 7.156 16 16 16S144 424.8 144 416zM240 416V192c0-8.844-7.156-16-16-16S208 183.2 208 192v224c0 8.844 7.156 16 16 16S240 424.8 240 416zM336 416V192c0-8.844-7.156-16-16-16S304 183.2 304 192v224c0 8.844 7.156 16 16 16S336 424.8 336 416z" />
                </svg>
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
