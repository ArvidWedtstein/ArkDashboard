import { MetaTags, useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Badge from "src/components/Util/Badge/Badge";
import Button from "src/components/Util/Button/Button";
import { Card, CardContent, CardHeader } from "src/components/Util/Card/Card";
import Chart from "src/components/Util/Chart/Chart";
import { Lookup } from "src/components/Util/Lookup/Lookup";
import Table from "src/components/Util/Table/Table";
import Toast from "src/components/Util/Toast/Toast";
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
  const [updateUser, { loading }] = useMutation(UPDATE_PROFILE_MUTATION, {
    onError: (error) => {
      console.error(`Failed updating user: ${error.message}`);
    },
  });

  type CommitAuthor = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  type Commit = {
    author: CommitAuthor;
    comments_url: string;
    sha: string;
    node_id: string;
    url: string;
    commit: {
      author: {
        name: string;
        email: string;
        date: string;
      };
      comment_count: number;
      committer: {
        name: string;
        email: string;
        date: string;
      };
      message: string;
      tree: {
        sha: string;
        url: string;
      };
      url: string;
      verification: {
        payload: string;
        reason: string;
        signature: string;
        verified: boolean;
      };
    };
    committer: CommitAuthor;
    html_url: string;
    parents: {
      sha: string;
      url: string;
      html_url: string;
    }[];
  };
  const [githubCommits, setGithubCommits] = useState<Commit[]>([]);
  // Fetch Github data
  useEffect(() => {
    fetch(
      "https://api.github.com/repos/arvidwedtstein/ArkDashboard/commits?sha=1bc1c549eb8573f1719432e7e66ce34dca8b35bc"
    )
      .then((response) => response.json())
      .then((data) => setGithubCommits(data));
  }, []);

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
          <Card className="flex items-start bg-zinc-200 text-left shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Finished Basespots`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={`${formatNumber(
                (optimizedBasespots.filter((b) => b.progress == 100).length /
                  optimizedBasespots.length) *
                100,
                { maximumSignificantDigits: 3 }
              ).toString()} / 100`}
              subheaderProps={{ className: "text-xl !font-bold !text-white" }}
            />
            <CardContent>
              <div className="relative w-auto flex-initial">
                <svg
                  viewBox="0 0 36 36"
                  className="inline-flex h-20 w-20 items-center justify-center text-center text-white"
                >
                  <path
                    className="stroke-pea-800 fill-none stroke-1"
                    d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                  ></path>
                  <path
                    className={clsx(
                      "animate-circle-progress fill-none stroke-2",
                      "stroke-pea-500"
                    )}
                    strokeLinecap="round"
                    strokeDasharray={`${formatNumber(
                      (optimizedBasespots.filter((b) => b.progress == 100)
                        .length /
                        optimizedBasespots.length) *
                      100,
                      { maximumSignificantDigits: 3 }
                    )}, 100`}
                    d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                  ></path>
                  <text
                    textAnchor="middle"
                    x="18"
                    y="19.35"
                    dominantBaseline="middle"
                    fontSize={8}
                    className="fill-black text-center font-normal dark:fill-white"
                  >
                    {formatNumber(
                      (optimizedBasespots.filter((b) => b.progress == 100)
                        .length /
                        optimizedBasespots.length) *
                      100,
                      { maximumSignificantDigits: 3 }
                    )}
                    %
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="flex items-start bg-zinc-200 text-left shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Goal: 20 basespots per map`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={(
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
              subheaderProps={{ className: "text-xl !font-bold !text-white" }}
            />
            <CardContent>
              <div className="relative w-auto flex-initial">
                <svg
                  viewBox="0 0 36 36"
                  className="inline-flex h-20 w-20 items-center justify-center text-center text-white"
                >
                  <path
                    className="stroke-pea-800 fill-none stroke-1"
                    d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                  ></path>
                  <path
                    className={clsx(
                      "animate-circle-progress fill-none stroke-2",
                      "stroke-pea-500"
                    )}
                    strokeLinecap="round"
                    strokeDasharray={`${(
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
                    ).toPrecision(3)}, 100`}
                    d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                  ></path>
                  <text
                    textAnchor="middle"
                    x="18"
                    y="19.35"
                    dominantBaseline="middle"
                    fontSize={8}
                    className="fill-black text-center font-normal dark:fill-white"
                  >
                    {(
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
                    %
                  </text>
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="grow bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardContent>
              <Chart
                margin={{
                  top: 40,
                  left: 40,
                  right: 40,
                }}
                type="line"
                height={200}
                dataset={Object.entries(
                  groupDatesByMonth(
                    profiles
                      .map((p) => new Date(p.created_at))
                      .sort((a, b) => a.getTime() - b.getTime())
                  )
                ).map(([k, v]: [k: string, v: unknown[]]) => ({
                  month: new Date(k).toLocaleDateString("en-GB", {
                    month: "short",
                  }),
                  newUsers: v.length,
                }))}
                series={[
                  {
                    area: true,
                    color: "#34b364",
                    dataKey: "newUsers",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    dataKey: "month",
                    label: "New Users in the last months",
                  },
                ]}
              // title={"New Users in the last months"}
              />
            </CardContent>
          </Card>
        </div>

        <Table
          rows={optimizedBasespots}
          checkSelect
          settings={{
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
              valueFormatter: ({ value }) => truncate(value.toString(), 70),
            },
            {
              header: "Map",
              field: "Map",
              valueFormatter: ({ value }) => value.name,
              sortable: true,
            },
            {
              header: "prg",
              field: "progress",
              render: ({ value, row }) => {
                let color = "bg-red-500";

                if (value <= 20) {
                  color = "bg-red-500";
                } else if (value <= 40 && value > 20) {
                  color = "bg-orange-500";
                } else if (value > 40 && value <= 60) {
                  color = "bg-yellow-500";
                } else if (value > 60 && value <= 80) {
                  color = "bg-lime-500";
                } else if (value <= 100 && value > 80) {
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
                      />
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

        <div className="relative my-12 mx-auto max-w-2xl px-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-500" />
          </div>
          <div className="relative flex justify-center text-black dark:text-white">
            <span className="bg-white px-3 text-base font-semibold dark:bg-zinc-900">
              Users
            </span>
          </div>
        </div>

        <Table
          rows={profiles}
          checkSelect
          settings={{
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
                <Badge standalone content={
                  <>
                    <svg
                      className="mr-1.5 h-2.5 w-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                    </svg>
                    {relativeDate(new Date(value))}
                  </>} variant="outlined" color="secondary" />
              ),
            },
            {
              header: "Actions",
              field: "id",
              render: ({ value, row }) => (
                <div className="inline-flex gap-x-2">
                  {/* Bans for one week */}
                  <Button
                    className="group"
                    color="error"
                    disabled={loading}
                    onClick={() => {
                      toast.custom((t) => (
                        <Toast
                          t={t}
                          title={`You're about to ban ${row.username}`}
                          message={`Are you sure you want to ban ${row.username} for one week?`}
                          actionType="YesNo"
                          primaryAction={() => {
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
                        />
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
                  </Button>
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
                  <Badge standalone content={
                    <>
                      <svg
                        className="mr-1.5 h-2.5 w-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                      </svg>
                      {relativeDate(new Date(value))}
                    </>} variant="outlined" color="secondary" />
                ),
            },
            {
              header: "Role",
              field: "role_id",
              sortable: true,
              render: ({ value, row }) => (
                <Lookup
                  label="Role"
                  disabled={loading}
                  margin="none"
                  getOptionLabel={(option) => option.name}
                  defaultValue={value}
                  getOptionValue={(opt) => opt.id}
                  isOptionEqualToValue={(val, opt) => opt.id === val.id}
                  options={roles || []}
                  onChange={(e, val) => {
                    if (!val || val.id === value) return;
                    toast.custom((t) => (
                      <Toast
                        t={t}
                        title={`You're about to change ${row.username}'s role`}
                        message={`Are you sure you want to change ${row.username
                          }'s role from ${roles.find((r) => r.id == value)?.name
                          } to ${val?.name}?`}
                        actionType="OkCancel"
                        primaryAction={() => {
                          toast.promise(
                            updateUser({
                              variables: {
                                id: row.id,
                                input: { role_id: val.id },
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
                      />
                    ));
                  }}
                  size="small"
                />
              ),
            },
          ]}
        />

        <div className="relative my-12 mx-auto max-w-2xl px-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-500" />
          </div>
          <div className="relative flex justify-center text-black dark:text-white">
            <span className="bg-white px-3 text-base font-semibold dark:bg-zinc-900">
              Commits
            </span>
          </div>
        </div>

        <Table
          rows={githubCommits}
          settings={{
            pagination: {
              enabled: true,
              rowsPerPage: 10,
              pageSizeOptions: [10, 25, 50, 100],
            },
          }}
          columns={[
            {
              header: "User",
              field: "committer",
              sortable: true,
              render: ({ value }) => (
                <div className="flex items-center gap-x-4">
                  <img
                    src={value.avatar_url}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-ellipsis whitespace-nowrap text-sm font-medium leading-6">
                    {value.login}
                  </span>
                </div>
              ),
            },
            {
              header: "Commit",
              field: "commit",
              render: ({ value }) => (
                <div className="flex items-center gap-x-3 leading-6">
                  <a
                    target="_blank"
                    rel="noopener"
                    href={`https://github.com/ArvidWedtstein/ArkDashboard/commit/${value.tree.sha}`}
                    className="text-ellipsis whitespace-nowrap font-mono text-sm leading-6"
                  >
                    {value.tree.sha.slice(0, 7)}
                  </a>
                  <Badge standalone content={"dev"} variant="outlined" color="secondary" />
                </div>
              ),
            },
            {
              header: "Changes",
              field: "commit",
              valueFormatter: ({ value }) => value.message,
              render: ({ value }) => (
                <div className="flex items-center gap-x-3">
                  {/* <div className={clsx("p-1 rounded-full flex-none", {
                    "text-pea-500 bg-pea-500/20": value.verified,
                    "text-red-500 bg-red-500/20": !value.verified
                  })}>
                    <div className="bg-current rounded-full w-1.5 h-1.5" />
                  </div> */}
                  <span className="whitespace-pre-line text-sm leading-6">
                    {value}
                  </span>
                </div>
              ),
            },
            {
              header: "Commited at",
              field: "commit",
              valueFormatter: ({ value }) => value.author.date,
              sortable: true,
              datatype: "date",
              render: ({ value }) => relativeDate(value),
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
