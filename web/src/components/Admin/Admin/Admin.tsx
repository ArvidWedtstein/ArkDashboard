import { MetaTags, useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useMemo, useRef } from "react";
import Chart from "src/components/Util/Chart/Chart";
import StatCard from "src/components/Util/StatCard/StatCard";
import Table from "src/components/Util/Table/Table";
import {
  formatNumber,
  getHexCodeFromPercentage,
  groupBy,
  relativeDate,
  truncate,
} from "src/lib/formatters";
import { FindAdminData } from "types/graphql";

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfileMutation($id: String!, $input: UpdateProfileInput!) {
    updateProfile(id: $id, input: $input) {
      id
      username
      role_id
      banned_until
      steam_user_id
    }
  }
`;

const Admin = ({ basespots, profiles, roles }: FindAdminData) => {
  const [updateUser, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION,
    {
      onError: (error) => {
        console.error(`Failed updating user: ${error.message}`);
      },
    }
  );

  const optimizedBasespots = useMemo(() => {
    return basespots.map((base) => {
      const totalSteps = 5;
      const missingSteps: string[] = [];
      let completedSteps = 0;

      if (base.description && base.description.length < 70) {
        completedSteps += 0.5;
      }
      if (base.description && base.description.length >= 70) {
        completedSteps += 1;
      } else {
        missingSteps.push("Add longer description");
      }

      if (base.thumbnail) {
        completedSteps += 1;
      } else {
        missingSteps.push("Add preview image");
      }

      if (base.estimated_for_players) {
        completedSteps += 1;
      } else {
        missingSteps.push("Add estimated for players / tribe size");
      }

      if (
        base.latitude &&
        base.latitude > 0 &&
        base.longitude &&
        base.longitude > 0
      ) {
        completedSteps += 1;
      } else {
        missingSteps.push("Add location coords");
      }

      if (base.type) {
        completedSteps += 1;
      } else {
        missingSteps.push("Add spot type e.g cave, rathole, ceiling");
      }
      return {
        ...base,
        progress: (completedSteps / totalSteps) * 100,
        missingSteps: missingSteps.join(",\n"),
      };
    });
  }, [basespots]);

  const groupDatesByMonth = (datesArray) => {
    const groupedDates = {};

    datesArray.forEach((date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based index (0 for January, 11 for December)
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!groupedDates[key]) {
        groupedDates[key] = [];
      }

      groupedDates[key].push(date);
    });

    return groupedDates;
  };
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      <div className="container-xl m-4 overflow-hidden p-3 text-center">
        <div className="mb-3 flex flex-col-reverse space-x-3 md:flex-row">
          <StatCard
            stat={"Finsihed Basespots"}
            value={formatNumber(
              (optimizedBasespots.filter((b) => b.progress == 100).length /
                optimizedBasespots.length) *
                100,
              { maximumSignificantDigits: 3 }
            )}
            subtext={`${formatNumber(
              (optimizedBasespots.filter((b) => b.progress == 100).length /
                optimizedBasespots.length) *
                100,
              { maximumSignificantDigits: 3 }
            )} / 100`}
          />
          <StatCard
            stat={"Goal: 20 basespots per map"}
            value={(
              Object.entries(groupBy(optimizedBasespots, "map_id"))
                .map(([k, v]) => ({
                  map_id: k,
                  map_name: v[0].Map.name,
                  basespots: v.length,
                  percent: (v.slice(0, 20).length / 20) * 100,
                }))
                // .filter((g) => g.map_id === "12")
                .reduce((acc, curr) => {
                  return acc + curr.percent;
                }, 0) / 12
            ).toPrecision(3)}
          />
          <StatCard stat={"Test"} value={10} />
          <Chart
            options={{ verticalLabels: true, horizontalLabels: true }}
            className="rounded-lg border border-transparent bg-gray-200 text-black shadow-lg transition ease-in-out dark:bg-zinc-700 dark:text-white"
            height={100}
            data={Object.values(
              groupDatesByMonth(
                profiles
                  .map((p) => new Date(p.created_at))
                  .sort((a, b) => a.getTime() - b.getTime())
              )
            ).map((g: Date[]) => g.length)}
            labels={Object.keys(
              groupDatesByMonth(
                profiles
                  .map((p) => new Date(p.created_at))
                  .sort((a, b) => a.getTime() - b.getTime())
              )
            ).map((p) =>
              new Date(p).toLocaleDateString("en-GB", { month: "short" })
            )}
            title={"New Users in the last months"}
          />
        </div>

        <Table
          rows={optimizedBasespots}
          settings={{
            select: true,
            pagination: {
              enabled: true,
              rowsPerPage: 10,
              pageSizeOptions: [10, 25, 50, 100],
            },
          }}
          columns={[
            {
              header: "Name",
              field: "name",
              sortable: true,
            },
            {
              header: "Description",
              field: "description",
              sortable: true,
              valueFormatter: ({ value }) => truncate(value, 70),
            },
            {
              header: "Map",
              field: "Map.name",
              sortable: true,
            },
            {
              header: "prg",
              field: "progress",
              render: ({ value, row }) => {
                let color = "bg-red-500";
                switch (true) {
                  case value <= 20:
                    color = "bg-red-500";
                  case value <= 40 && value > 20:
                    color = "bg-orange-500";
                  case value > 40 && value <= 60:
                    color = "bg-yellow-500";
                  case value > 60 && value <= 80:
                    color = "bg-lime-500";
                  case value <= 100 && value > 80:
                    color = "bg-green-500";
                }

                return (
                  <dd
                    className="flex items-center space-x-2"
                    title={row.missingSteps}
                  >
                    <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded bg-[${getHexCodeFromPercentage(
                          value
                        )}]`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="hidden text-sm font-medium text-gray-500 dark:text-gray-400 md:block">
                      {value}%
                    </span>
                  </dd>
                );
              },
            },
          ]}
        />

        <hr className="my-3 bg-zinc-500" />

        <Table
          rows={profiles}
          settings={{
            select: true,
            pagination: {
              enabled: true,
              rowsPerPage: 10,
              pageSizeOptions: [10, 25, 50, 100],
            },
          }}
          columns={[
            {
              header: "Avatar",
              field: "avatar_url",
              className: "w-12",
              render: ({ value, row }) =>
                value && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      !!value
                        ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${value}`
                        : `https://ui-avatars.com/api/?name=${row?.username}`
                    }
                    alt={"Profile Image"}
                  />
                ),
            },
            {
              header: "Name",
              field: "username",
              sortable: true,
            },
            {
              header: "Created",
              field: "created_at",
              className: "w-fit",
              sortable: true,
              datatype: "date",
              render: ({ value }) => (
                <span className="rw-badge rw-badge-gray-outline">
                  <svg
                    className="mr-1.5 h-2.5 w-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                  </svg>
                  {relativeDate(new Date(value), "days")}
                </span>
              ),
            },
            {
              header: "Actions",
              field: "id",
              render: ({ value, row }) => (
                <div className="inline-flex gap-x-2">
                  {/* Bans for one week */}
                  <button
                    disabled={loading}
                    className="rw-button rw-button-small rw-button-red-outline group"
                    onClick={() => {
                      toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? "animate-fly-in" : "animate-fade-out"
                          } mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-zinc-800 dark:text-red-400`}
                          role="alert"
                        >
                          <div className="flex items-center">
                            <svg
                              className="mr-2 h-4 w-4 flex-shrink-0"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <h3 className="text-lg font-medium">
                              You're about to ban <b>{row.username}</b>
                            </h3>
                          </div>
                          <div className="mt-2 mb-4 text-sm">
                            <p>
                              Are you sure you want to ban {row.username} for
                              one week?
                            </p>
                          </div>
                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => {
                                toast.dismiss(t.id);
                                toast.promise(
                                  updateUser({
                                    variables: {
                                      id: value.toString(),
                                      input: {
                                        banned_until: new Date(
                                          new Date().getTime() +
                                            1000 * 60 * 60 * 24 * 7
                                        ),
                                      },
                                    },
                                  }),
                                  {
                                    loading: "Banning user...",
                                    success: ({ data }) =>
                                      `Successfully banned ${data.updateProfile.username}`,
                                    error: ({ data }) =>
                                      `Failed to ban ${data.updateProfile.username}`,
                                  }
                                );
                              }}
                              className="mr-2 inline-flex items-center rounded-lg bg-red-800 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                fill="currentColor"
                                className="-ml-0.5 mr-2 h-3 w-3"
                              >
                                <path d="M512 208.3c0-9.103-7.43-16-15.99-16c-4.091 0-8.183 1.562-11.31 4.688l-12.7 12.7L302.4 40l12.68-12.69C318.2 24.19 319.8 20.09 319.8 16c0-9.103-7.43-16-15.99-16c-4.091 0-8.183 1.562-11.31 4.688l-143.9 144C145.5 151.8 143.9 155.9 143.9 160c0 9.103 7.43 16 15.99 16c4.091 0 8.183-1.562 11.31-4.688l12.68-12.69l73.39 73.44l-75.46 78.11L172.4 300.7c-8.456-8.437-19.56-12.67-30.64-12.67c-11.13 0-22.26 4.234-30.73 12.67l-98.31 98.38C4.232 407.6 0 418.7 0 429.8s4.232 22.23 12.7 30.7l38.76 38.78C59.65 507.5 70.55 512 82.14 512c11.6 0 22.5-4.5 30.69-12.72l98.31-98.34c8.464-8.469 12.7-19.59 12.7-30.7S219.6 348 211.1 339.5l-6.711-6.719l75.47-78.12l73.56 73.6l-12.66 12.67c-3.123 3.125-4.685 7.219-4.685 11.31c0 9.103 7.43 16 15.99 16c4.092 0 8.183-1.562 11.31-4.688l143.9-144C510.4 216.5 512 212.4 512 208.3zM191.9 370.2c0 2.922-1.113 5.844-3.338 8.078l-98.32 98.34c-2.139 2.156-5.095 3.234-8.054 3.234c-2.959 0-5.923-1.078-8.078-3.234l-38.76-38.78c-2.225-2.234-3.338-5.156-3.338-8.078s1.113-5.844 3.338-8.078l98.31-98.38c2.218-2.219 5.138-3.312 8.074-3.312c2.92 0 5.856 1.094 8.089 3.344l38.74 38.78C190.7 364.4 191.9 367.3 191.9 370.2zM206.5 136l73.33-73.38l169.6 169.7l-73.33 73.38L206.5 136z" />
                              </svg>
                              Ban
                            </button>
                            <button
                              type="button"
                              onClick={() => toast.dismiss(t.id)}
                              className="rounded-lg border border-red-800 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-red-800 hover:bg-red-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-600 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-800"
                              data-dismiss-target="#alert-additional-content-2"
                              aria-label="Close"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="h-5 w-5 transition duration-75 ease-in-out group-hover:rotate-45"
                    >
                      <path d="M512 208.3c0-9.103-7.43-16-15.99-16c-4.091 0-8.183 1.562-11.31 4.688l-12.7 12.7L302.4 40l12.68-12.69C318.2 24.19 319.8 20.09 319.8 16c0-9.103-7.43-16-15.99-16c-4.091 0-8.183 1.562-11.31 4.688l-143.9 144C145.5 151.8 143.9 155.9 143.9 160c0 9.103 7.43 16 15.99 16c4.091 0 8.183-1.562 11.31-4.688l12.68-12.69l73.39 73.44l-75.46 78.11L172.4 300.7c-8.456-8.437-19.56-12.67-30.64-12.67c-11.13 0-22.26 4.234-30.73 12.67l-98.31 98.38C4.232 407.6 0 418.7 0 429.8s4.232 22.23 12.7 30.7l38.76 38.78C59.65 507.5 70.55 512 82.14 512c11.6 0 22.5-4.5 30.69-12.72l98.31-98.34c8.464-8.469 12.7-19.59 12.7-30.7S219.6 348 211.1 339.5l-6.711-6.719l75.47-78.12l73.56 73.6l-12.66 12.67c-3.123 3.125-4.685 7.219-4.685 11.31c0 9.103 7.43 16 15.99 16c4.092 0 8.183-1.562 11.31-4.688l143.9-144C510.4 216.5 512 212.4 512 208.3zM191.9 370.2c0 2.922-1.113 5.844-3.338 8.078l-98.32 98.34c-2.139 2.156-5.095 3.234-8.054 3.234c-2.959 0-5.923-1.078-8.078-3.234l-38.76-38.78c-2.225-2.234-3.338-5.156-3.338-8.078s1.113-5.844 3.338-8.078l98.31-98.38c2.218-2.219 5.138-3.312 8.074-3.312c2.92 0 5.856 1.094 8.089 3.344l38.74 38.78C190.7 364.4 191.9 367.3 191.9 370.2zM206.5 136l73.33-73.38l169.6 169.7l-73.33 73.38L206.5 136z" />
                    </svg>
                  </button>
                </div>
              ),
            },
            profiles.some((p) => p.banned_until != null) && {
              header: "Banned",
              field: "banned_until",
              sortable: true,
              datatype: "date",
              render: ({ value }) =>
                value && (
                  <span className="rw-badge rw-badge-gray-outline">
                    <svg
                      className="mr-1.5 h-2.5 w-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    {relativeDate(new Date(value), "days")}
                  </span>
                ),
            },
            {
              header: "Role",
              field: "role_id",
              sortable: true,
              render: (
                { value, row } // TODO: find better toast colors / make rw-toast class
              ) => (
                <select
                  className="rw-input rw-input-small"
                  disabled={loading}
                  defaultValue={value}
                  onChange={(e) => {
                    toast.custom((t) => (
                      <div
                        className={`${
                          t.visible ? "animate-fly-in" : "animate-fade-out"
                        } text-pea-800 border-pea-300 bg-pea-50 dark:text-pea-400 dark:border-pea-800 mb-4 rounded-lg border p-4 dark:bg-zinc-700`}
                        role="alert"
                      >
                        <div className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 flex-shrink-0"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <span className="sr-only">Info</span>
                          <h3 className="text-lg font-medium">
                            You're about to change the role{" "}
                            <b>{row.username}</b>
                          </h3>
                        </div>
                        <div className="mt-2 mb-4 text-sm">
                          <p>
                            Are you sure you want to change {row.username}'s
                            role from {roles.find((r) => r.id == value)?.name}{" "}
                            to {roles.find((r) => r.id == e.target.value)?.name}
                            ?
                          </p>
                        </div>
                        <div className="flex gap-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              toast.dismiss(t.id);
                              toast.promise(
                                updateUser({
                                  variables: {
                                    id: row.id,
                                    input: { role_id: e.target.value },
                                  },
                                }),
                                {
                                  loading: "Changing role...",
                                  success: ({ data }) =>
                                    `Successfully Updated ${data.updateProfile.username}`,
                                  error: ({ data }) =>
                                    `Failed to update ${data.updateProfile.username}`,
                                }
                              );
                            }}
                            className="rw-button rw-button-medium rw-button-green-outline"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => toast.dismiss(t.id)}
                            className="rounded-lg border border-red-800 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-red-800 hover:bg-red-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-600 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-800"
                            data-dismiss-target="#alert-additional-content-2"
                            aria-label="Close"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ));
                  }}
                >
                  {roles &&
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                </select>
              ),
            },
          ]}
        />
      </div>
      {/* <div className="flex items-center mb-5">
            <p className="bg-blue-100 text-blue-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-blue-200 dark:text-blue-800">8.7</p>
            <p className="ml-2 font-medium text-gray-900 dark:text-white">Excellent</p>
            <span className="w-1 h-1 mx-2 bg-gray-900 rounded-full dark:bg-gray-500"></span>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">376 reviews</p>
            <a href="#" className="ml-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Read all reviews</a>
          </div>
          <div className="gap-8 sm:grid sm:grid-cols-2">
            <div>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.8</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Comfort</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Free WiFi</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.8</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Facilities</dt>
                <dd className="flex items-center">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '54%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">5.4</span>
                </dd>
              </dl>
            </div>
            <div>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Value for money</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Cleanliness</dt>
                <dd className="flex items-center mb-3">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">7.0</span>
                </dd>
              </dl>
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                <dd className="flex items-center">
                  <div className="w-full bg-gray-200 rounded h-2.5 dark:bg-gray-700 mr-2">
                    <div className="bg-blue-600 h-2.5 rounded dark:bg-blue-500" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">8.9</span>
                </dd>
              </dl>
            </div>
          </div> */}
    </>
  );
};

export default Admin;
