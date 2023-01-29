import type {
  QueryResolvers,
  MutationResolvers,
  ProfileRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const profiles: QueryResolvers['profiles'] = () => {
  return db.profile.findMany()
}

export const profile: QueryResolvers['profile'] = ({ id }) => {
  return db.profile.findUnique({
    where: { id },
  })
}

export const createProfile: MutationResolvers['createProfile'] = ({
  input,
}) => {
  return db.profile.create({
    data: input,
  })
}

export const updateProfile: MutationResolvers['updateProfile'] = ({
  id,
  input,
}) => {
  return db.profile.update({
    data: input,
    where: { id },
  })
}

export const deleteProfile: MutationResolvers['deleteProfile'] = ({ id }) => {
  return db.profile.delete({
    where: { id },
  })
}

export const Profile: ProfileRelationResolvers = {
  Message: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Message()
  },
  role_profile_role_idTorole: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .role_profile_role_idTorole()
  },
  Timeline: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Timeline()
  },
  Tribe: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Tribe()
  },
}
