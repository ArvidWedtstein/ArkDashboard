import type { FindTimelineSeasonBasespotById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import TimelineSeasonBasespot from "src/components/TimelineSeasonBasespot/TimelineSeasonBasespot";

export const QUERY = gql`
  query FindTimelineSeasonBasespotById($id: BigInt!) {
    timelineSeasonBasespot: timelineSeasonBasespot(id: $id) {
      id
      created_at
      updated_at
      start_date
      end_date
      basespot_id
      map_id
      created_by
      latitude
      longitude
      Map {
        name
        img
      }
      TimelineSeason {
        id
        tribe_name
        season
        server
        cluster
        TimelineSeasonEvent {
          id
          title
          content
          created_at
          tags
        }
      }
      Basespot {
        id
        name
        latitude
        longitude
      }
    }
  }
`;

export const Loading = () => (
  <div role="status" className="flex animate-pulse flex-col space-y-8">
    <div className="flex">
      <div className="flex w-full flex-col flex-wrap py-6 text-center lg:flex-grow lg:w-1/2 lg:pr-12 lg:text-left">
        <div className="flex flex-col space-y-2.5">
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-64 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-80 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-32 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-24 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-80 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex w-full items-center space-x-2">
            <div className="h-2.5 w-60 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-full rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="h-2.5 w-40 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="flex flex-row gap-x-3 py-6 w-full">
            <div className="h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
      <div className="aspect-square h-96 rounded-lg bg-zinc-200 dark:bg-zinc-600" />
    </div>
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-3 w-full">
        <div className="h-5 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-5 w-64 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>

      <div className="flex flex-col justify-center items-center gap-y-5 w-full my-12">
        <div className="h-8 w-60 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-5 w-1/2 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-5 w-1/6 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-3 w-1/4 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Empty = () => <div>TimelineSeasonBasespot not found</div>;

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
);

export const Success = ({
  timelineSeasonBasespot,
}: CellSuccessProps<FindTimelineSeasonBasespotById>) => {
  return (
    <TimelineSeasonBasespot timelineSeasonBasespot={timelineSeasonBasespot} />
  );
};
