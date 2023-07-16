import { navigate, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useAuth } from "src/auth";

import { QUERY } from "src/components/Profile/ProfilesCell";
import { ContextMenu } from "src/components/Util/ContextMenu/ContextMenu";
import Table from "src/components/Util/Table/Table";
import Tooltip from "src/components/Util/Tooltip/Tooltip";
import { formatEnum, timeTag } from "src/lib/formatters";

import type {
  DeleteProfileMutationVariables,
  FindProfiles,
  permission,
} from "types/graphql";

const DELETE_PROFILE_MUTATION = gql`
  mutation DeleteProfileMutation($id: String!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

const ProfilesList = ({ profiles }: FindProfiles) => {
  const { currentUser } = useAuth();
  const [deleteProfile] = useMutation(DELETE_PROFILE_MUTATION, {
    onCompleted: () => {
      toast.success("Profile deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  });
  const mapImages = {
    TheIsland:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/62a15c04-bef2-45a2-a06a-c984d81c3c0b/dd391pu-a40aaf7b-b8e7-4d6d-b49d-aa97f4ad61d0.jpg",
    TheCenter:
      "https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712",
    ScorchedEarth: "https://wallpapercave.com/wp/wp10504822.jpg",
    Ragnarok:
      "https://cdn.survivetheark.com/uploads/monthly_2016_10/large.580b5a9c3b586_Ragnarok02.jpg.6cfa8b30a81187caace6fecc1e9f0c31.jpg",
    Aberration:
      "https://cdn.images.express.co.uk/img/dynamic/143/590x/ARK-Survival-Evolved-849382.jpg",
    Extinction:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/887380/ss_3c2c1d7c027c8beb54d2065afe3200e457c2867c.1920x1080.jpg?t=1594677636",
    Valguero:
      "https://i.pinimg.com/originals/0b/95/09/0b9509ddce658e3209ece1957053b27e.jpg",
    Genesis:
      "https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386",
    CrystalIsles:
      "https://cdn2.unrealengine.com/egs-crystalislesarkexpansionmap-studiowildcard-dlc-g1a-05-1920x1080-119682147.jpg?h=720&resize=1&w=1280",
    Fjordur:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447",
    LostIsland:
      "https://dicendpads.com/wp-content/uploads/2021/12/Ark-Lost-Island.png",
    Genesis2:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444",
  };
  const onDeleteClick = (id: DeleteProfileMutationVariables["id"]) => {
    if (
      currentUser &&
      currentUser.permissions.some((p: permission) => p == "user_delete") &&
      confirm("Are you sure you want to delete profile " + id + "?")
    ) {
      deleteProfile({ variables: { id } });
    }
  };

  return (
    <div className="rw-segment">
      <div className="flex flex-wrap">
        {profiles
          .filter(
            (profile) => !!profile.username && profile.full_name.length > 0
          )
          .map((profile) => (
            <figure className="font-montserrat relative m-3 w-full max-w-xs overflow-hidden rounded-lg bg-zinc-700 text-left leading-6 text-white">
              <img
                // src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample60.jpg"
                src={
                  mapImages[
                    Object.keys(mapImages)[
                      Math.floor(Math.random() * Object.keys(mapImages).length)
                    ]
                  ]
                }
                alt={`${profile.full_name} bg-image`}
                className=" max-w-full align-top opacity-80"
              />
              <figcaption className="before:border-skew relative flex w-full flex-col bg-zinc-700 p-6 before:absolute before:left-0 before:bottom-full before:h-0 before:w-0 before:border-transparent before:border-l-zinc-700 before:content-['']">
                <img
                  src={
                    profile.avatar_url
                      ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
                      : `https://ui-avatars.com/api/?name=${profile?.full_name}`
                  }
                  alt={profile.full_name}
                  className="absolute left-6 bottom-full aspect-square max-w-[90px] rounded-full opacity-100 shadow-lg"
                />

                <h2 className="mb-1 text-base font-normal">
                  {profile.full_name}
                  <span className="text-pea-500 block text-sm">
                    {profile.role_profile_role_idTorole.name}
                  </span>
                </h2>
                <p className="flex-auto text-sm tracking-wide opacity-80">
                  {profile.biography}
                </p>
                <div className="justify-self-end">
                  <a
                    href="#"
                    className="rw-button rw-button-blue-outline rw-button-small opacity-60 hover:opacity-100"
                  >
                    Follow
                  </a>
                  <a
                    href="#"
                    className="rw-button rw-button-gray-outline rw-button-small ml-2"
                  >
                    More Info
                  </a>
                </div>
              </figcaption>
            </figure>
          ))}
      </div>
      <Table
        rows={profiles}
        columns={[
          {
            field: "username",
            header: "Username",
            sortable: true,
          },
          {
            field: "full_name",
            header: "Name",
            sortable: true,
          },
          {
            field: "avatar_url",
            header: "Avatar",
            render({ value, row }) {
              return (
                <Tooltip
                  content={
                    <figure className="font-montserrat relative w-full max-w-xs rounded-lg bg-zinc-700 text-left leading-6 text-white">
                      <img
                        // src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/331810/sample60.jpg"
                        src={
                          mapImages[
                            Object.keys(mapImages)[
                              Math.floor(
                                Math.random() * Object.keys(mapImages).length
                              )
                            ]
                          ]
                        }
                        alt={`${row.full_name} bg-image`}
                        className="max-w-full align-top opacity-80"
                      />
                      <figcaption className="before:border-skew relative w-full bg-zinc-700 before:absolute before:right-0 before:left-0 before:bottom-full before:h-0 before:w-0 before:border-transparent before:border-l-zinc-700 before:content-['']">
                        <img
                          src={
                            value
                              ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${value}`
                              : `https://ui-avatars.com/api/?name=${row?.full_name}`
                          }
                          alt={row.full_name}
                          className="absolute left-6 bottom-full aspect-square max-w-[90px] rounded-full opacity-100 shadow-lg"
                        />
                        <h2 className="mb-1 font-light">
                          {row.full_name}
                          <span className="text-pea-500 block text-xs">
                            {row.role_profile_role_idTorole.name}
                          </span>
                        </h2>
                        <p className="mb-2 flex-auto text-sm tracking-wide opacity-80">
                          {row.biography}
                        </p>
                      </figcaption>
                    </figure>
                  }
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      value
                        ? `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${value}`
                        : `https://ui-avatars.com/api/?name=${row?.full_name}`
                    }
                    alt="Profile Image"
                  />
                </Tooltip>
              );
            },
          },
          {
            field: "updated_at",
            header: "Last Updated",
            sortable: true,
            valueFormatter: ({ value }) => timeTag(value),
          },
          {
            field: "created_at",
            header: "Created",
            sortable: true,
            valueFormatter: ({ value }) => timeTag(value),
          },
          {
            field: "role_id",
            header: "Role",
            valueFormatter: ({ row }) =>
              formatEnum(row.role_profile_role_idTorole.name),
          },
          {
            field: "id",
            header: "Actions",
            render: ({ row }) => (
              <ContextMenu
                type="click"
                items={[
                  {
                    label: "View",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        <path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z" />
                      </svg>
                    ),
                    onClick: () => {
                      navigate(routes.profile({ id: row["id"] }));
                    },
                  },
                  // {
                  //   label: "Edit",
                  //   icon: (
                  //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  //       <path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" />
                  //     </svg>
                  //   ),
                  //   onClick: () => {
                  //     navigate(routes.profile({ id: row["id"] }));
                  //   },
                  // },
                  // {
                  //   label: "Delete",
                  //   icon: (
                  //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  //       <path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" />
                  //     </svg>
                  //   ),
                  //   onClick: () => {
                  //     onDeleteClick(row["id"]);
                  //   },
                  // },
                ]}
              >
                <svg
                  className="w-4 fill-black text-black dark:fill-stone-200 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
                </svg>
              </ContextMenu>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProfilesList;
