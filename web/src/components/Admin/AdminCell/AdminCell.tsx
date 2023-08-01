import type { FindAdminData, FindAdminDataVariables } from "types/graphql";
import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";
import Admin from "../Admin/Admin";
import { toast } from "@redwoodjs/web/dist/toast";

export const QUERY = gql`
  query FindAdminData {
    basespots {
      id
      name
      description
      latitude
      longitude
      thumbnail
      created_at
      map_id
      estimated_for_players
      type
      Map {
        name
      }
    }
    profiles {
      id
      username
      created_at
      avatar_url
    }
  }
`;

// TODO: fix skeleton loader
export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Empty</div>;

export const Failure = ({
  error,
}: CellFailureProps<FindAdminDataVariables>) => {
  toast.error(error.message);
  console.error(error)
  return <div style={{ color: "red" }}>Error: {error?.message}</div>;
};

export const Success = ({
  basespots,
  profiles,
}: CellSuccessProps<FindAdminData, FindAdminDataVariables>) => {
  return <Admin basespots={basespots} profiles={profiles} />;
};
