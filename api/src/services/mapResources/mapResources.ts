import type {
  QueryResolvers,
  MutationResolvers,
  MapResourceRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";

export const mapResourcesByMap: QueryResolvers["mapResourcesByMap"] = ({
  map_id,
  item_id,
}) => {
  return db.mapResource.findMany({
    where: {
      OR: [
        {
          map_id,
        },
        {
          item_id,
        },
      ],
    },
  });
};
export const mapResources: QueryResolvers["mapResources"] = () => {
  return db.mapResource.findMany();
};

export const mapResource: QueryResolvers["mapResource"] = ({ id }) => {
  return db.mapResource.findUnique({
    where: { id },
  });
};

export const createMapResource: MutationResolvers["createMapResource"] = ({
  input,
}) => {
  return db.mapResource.create({
    data: input,
  });
};

export const updateMapResource: MutationResolvers["updateMapResource"] = ({
  id,
  input,
}) => {
  return db.mapResource.update({
    data: input,
    where: { id },
  });
};

export const deleteMapResource: MutationResolvers["deleteMapResource"] = ({
  id,
}) => {
  return db.mapResource.delete({
    where: { id },
  });
};

export const MapResource: MapResourceRelationResolvers = {
  Item: (_obj, { root }) => {
    return db.mapResource.findUnique({ where: { id: root?.id } }).Item();
  },
  Map: (_obj, { root }) => {
    return db.mapResource.findUnique({ where: { id: root?.id } }).Map();
  },
};
