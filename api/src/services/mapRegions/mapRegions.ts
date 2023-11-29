import type {
  QueryResolvers,
  MutationResolvers,
  MapRegionRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const mapRegionsByMap: QueryResolvers["mapRegionsByMap"] = ({
  map_id,
}: {
  map_id: number;
}) => {
  return db.mapRegion.findMany({
    where: { map_id },
  });
};
export const mapRegions: QueryResolvers["mapRegions"] = () => {
  return db.mapRegion.findMany();
};

export const mapRegion: QueryResolvers["mapRegion"] = ({ id }) => {
  return db.mapRegion.findUnique({
    where: { id },
  });
};

export const createMapRegion: MutationResolvers["createMapRegion"] = ({
  input,
}) => {
  return db.mapRegion.create({
    data: input,
  });
};

export const updateMapRegion: MutationResolvers["updateMapRegion"] = ({
  id,
  input,
}) => {
  return db.mapRegion.update({
    data: input,
    where: { id },
  });
};

export const deleteMapRegion: MutationResolvers["deleteMapRegion"] = ({
  id,
}) => {
  return db.mapRegion.delete({
    where: { id },
  });
};

export const MapRegion: MapRegionRelationResolvers = {
  Map: (_obj, { root }) => {
    return db.mapRegion.findUnique({ where: { id: root?.id } }).Map();
  },
};
