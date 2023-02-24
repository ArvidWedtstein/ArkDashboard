import type { FindMapById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Map from "src/components/Map/Map";

export const QUERY = gql`
  query FindMapById($id: BigInt!) {
    map: map(id: $id) {
      id
      created_at
      name
      loot_crates
      oil_veins
      water_veins
      wyvern_nests
      ice_wyvern_nests
      gas_veins
      deinonychus_nests
      charge_nodes
      plant_z_nodes
      drake_nests
      glitches
      magmasaur_nests
      poison_trees
      mutagen_bulbs
      carniflora
      notes
      img
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Map not found</div>;

export const Failure = ({ error }: CellFailureProps) => {
  return <div className="rw-cell-error">{error?.message}</div>;
};

export const Success = ({ map }: CellSuccessProps<FindMapById>) => {
  return <Map map={map} />;
};
