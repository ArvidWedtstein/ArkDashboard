import type {
  QueryResolvers,
  MutationResolvers,
  MapNoteRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const mapNotes: QueryResolvers['mapNotes'] = () => {
  return db.mapNote.findMany()
}

export const mapNote: QueryResolvers['mapNote'] = ({ id }) => {
  return db.mapNote.findUnique({
    where: { id },
  })
}

export const createMapNote: MutationResolvers['createMapNote'] = ({
  input,
}) => {
  return db.mapNote.create({
    data: input,
  })
}

export const updateMapNote: MutationResolvers['updateMapNote'] = ({
  id,
  input,
}) => {
  return db.mapNote.update({
    data: input,
    where: { id },
  })
}

export const deleteMapNote: MutationResolvers['deleteMapNote'] = ({ id }) => {
  return db.mapNote.delete({
    where: { id },
  })
}

export const MapNote: MapNoteRelationResolvers = {
  Map: (_obj, { root }) => {
    return db.mapNote.findUnique({ where: { id: root?.id } }).Map()
  },
}
