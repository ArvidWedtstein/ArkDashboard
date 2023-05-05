import type {
  QueryResolvers,
  MutationResolvers,
  MapCoordinateRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const mapCoordinates: QueryResolvers['mapCoordinates'] = () => {
  return db.mapCoordinate.findMany()
}

export const mapCoordinate: QueryResolvers['mapCoordinate'] = ({ id }) => {
  return db.mapCoordinate.findUnique({
    where: { id },
  })
}

export const createMapCoordinate: MutationResolvers['createMapCoordinate'] = ({
  input,
}) => {
  return db.mapCoordinate.create({
    data: input,
  })
}

export const updateMapCoordinate: MutationResolvers['updateMapCoordinate'] = ({
  id,
  input,
}) => {
  return db.mapCoordinate.update({
    data: input,
    where: { id },
  })
}

export const deleteMapCoordinate: MutationResolvers['deleteMapCoordinate'] = ({
  id,
}) => {
  return db.mapCoordinate.delete({
    where: { id },
  })
}

export const MapCoordinate: MapCoordinateRelationResolvers = {
  Map: (_obj, { root }) => {
    return db.mapCoordinate.findUnique({ where: { id: root?.id } }).Map()
  },
}
