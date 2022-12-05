import { useAuth } from "@redwoodjs/auth";
import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect } from "react";

import { QUERY } from "src/components/Tribe/TribesCell/TribesCell";
import Table from "src/components/Util/Table/Table";
import { getWeekDates, timeTag, truncate } from "src/lib/formatters";

import type { DeleteTribeMutationVariables, FindTribes } from "types/graphql";

const DELETE_TRIBE_MUTATION = gql`
  mutation DeleteTribeMutation($id: Int!) {
    deleteTribe(id: $id) {
      id
    }
  }
`;
// TODO: Create random tribe name generator
const TribesList = ({ tribes }: FindTribes) => {
  const [deleteTribe] = useMutation(DELETE_TRIBE_MUTATION, {
    onCompleted: () => {
      toast.success("Tribe deleted");
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

  const onDeleteClick = (id: DeleteTribeMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete tribe " + id + "?")) {
      deleteTribe({ variables: { id } });
    }
  };



  function filterDatesByCurrentWeek(dates: FindTribes["tribes"]) {
    let [start, end] = getWeekDates();
    return dates.filter(
      (d) => +new Date(d.createdAt) >= +start && +new Date(d.createdAt) < +end
    );
  }
  const pickRandomTribe = () => {
    let randomTribe = tribes[Math.floor(Math.random() * tribes.length)];
    let tempTribe = tribes.filter((t) => t.id === randomTribe.id);
    toast.success(`You've been assigned to ${tempTribe[0].name}!`);
  };
  return (
    <div className="rw-segment relative">
      <div className="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="flex items-start rounded-xl bg-white p-4 shadow-lg">
          {" "}
          {/* TODO: Create component for this  */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                strokeLinecap="round"
                stroke-linejoin="round"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="font-semibold">
              {filterDatesByCurrentWeek(tribes).length} {tribes.length > 1 ? "Tribes" : "Tribe"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">Created this week</p>
          </div>
        </div>
        <div className="flex items-start rounded-xl bg-white p-4 shadow-lg">
          {" "}
          {/* TODO: Create component for this  */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 fill-blue-400 text-blue-400"
              viewBox="0 0 512 512"
            >
              <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c-18 0-32 14-32 32s13.1 32 32 32c17.1 0 32-14 32-32S273.1 336 256 336zM289.1 128h-51.1C199 128 168 159 168 198c0 13 11 24 24 24s24-11 24-24C216 186 225.1 176 237.1 176h51.1C301.1 176 312 186 312 198c0 8-4 14.1-11 18.1L244 251C236 256 232 264 232 272V288c0 13 11 24 24 24S280 301 280 288V286l45.1-28c21-13 34-36 34-60C360 159 329 128 289.1 128z" />
            </svg>
          </div>
          <div className="ml-4">
            <button className="" onClick={pickRandomTribe}>
              Pick random tribe name
            </button>
          </div>
        </div>
      </div>
      {/* TODO: Replace user uuid with user name and profile picture */}
      <Table
        data={tribes}
        cols={["name", "description", "createdAt", "createdBy", "actions"]}
        renderActions={(row) => (
          <>
            <nav className="flex flex-row">
              <Link
                to={routes.tribe({ id: row["id"] })}
                title={"Show detail"}
                className="rw-button rw-button-small"
              >
                Show
              </Link>
            </nav>
          </>
        )}
      />
    </div>
  );
};

export default TribesList;
