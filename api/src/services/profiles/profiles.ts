import type {
  QueryResolvers,
  MutationResolvers,
  ProfileRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { validate, validateUniqueness, validateWith } from "@redwoodjs/api";

export const profiles: QueryResolvers["profiles"] = () => {
  return db.profile.findMany();
};

export const profile: QueryResolvers["profile"] = ({ id }) => {
  return db.profile.findUnique({
    where: { id },
  });
};

export const createProfile: MutationResolvers["createProfile"] = ({
  input,
}) => {
  validate(input.full_name, "Full Name", {
    presence: true,
    excludes: {
      in: ["Admin", "Owner"],
      message: "That name is reserved, sorry!",
    },
    length: { min: 2, max: 255 },
    format: {
      pattern: /^[A-Za-z]+$/,
      message: "Name can only contain letters",
    },
  });
  validateWith(() => {
    if (
      input.role_id === "f0c1b8e9-5f27-4430-ad8f-5349f83339c0" &&
      !(context.currentUser.role_id === "f0c1b8e9-5f27-4430-ad8f-5349f83339c0")
    ) {
      throw "Only Admins can summon new Admins";
    }
  });

  return db.profile.create({
    data: input,
  });
};

export const updateProfile: MutationResolvers["updateProfile"] = ({
  id,
  input,
}) => {
  return db.profile.update({
    data: input,
    where: { id },
  });
};

export const deleteProfile: MutationResolvers["deleteProfile"] = ({ id }) => {
  return db.profile.delete({
    where: { id },
  });
};

export const Profile: ProfileRelationResolvers = {
  Message: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Message();
  },
  role_profile_role_idTorole: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .role_profile_role_idTorole();
  },
  Timeline: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Timeline();
  },
  Tribe: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Tribe();
  },
};
