import type {
  QueryResolvers,
  MutationResolvers,
  ProfileRelationResolvers,
} from "types/graphql";

import { db } from "src/lib/db";
import { validate, validateUniqueness, validateWithSync } from "@redwoodjs/api";
import { hasPermission } from "src/lib/auth";

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
    exclusion: {
      in: ["Admin", "Owner"],
      message: "That name is reserved, sorry!",
    },
    length: { min: 2, max: 255 },
    format: {
      pattern: /^[A-Za-z]+$/,
      message: "Name can only contain letters",
    },
  });
  validateWithSync(() => {
    if (
      input.role_id === "f0c1b8e9-5f27-4430-ad8f-5349f83339c0" &&
      !(context.currentUser.role_id === "f0c1b8e9-5f27-4430-ad8f-5349f83339c0")
    ) {
      throw "Only Admins can summon new Admins";
    }
  });
  return validateUniqueness(
    "profile",
    { username: input.username },
    { message: "That username is already taken" },
    () => {
      return db.profile.create({
        data: input,
      });
    }
  );
};

export const updateProfile: MutationResolvers["updateProfile"] = ({
  id,
  input,
}) => {
  validateWithSync(() => {
    if (
      id !== context.currentUser.id &&
      !hasPermission({ permission: "user_update" })
    ) {
      throw new Error("You are not allowed to update other users");
    }
  });

  // validate(input.role_id, "role_id", {
  //   custom: {
  //     with: () => {
  //       if (
  //         input.role_id !== context.currentUser.role_id &&
  //         !hasPermission({ permission: "user_update" })
  //       ) {
  //         throw new Error("You are not allowed to change your own role");
  //       }
  //     },
  //     message: "You are not allowed to change your own role",
  //   },
  // });
  return validateUniqueness(
    "profile",
    { username: input.username, $self: { id } },
    { message: "That username is already taken" },
    () => {
      return db.profile.update({
        data: input,
        where: { id },
      });
    }
  );
};

export const deleteProfile: MutationResolvers["deleteProfile"] = ({ id }) => {
  return db.profile.delete({
    where: { id },
  });
};

export const Profile: ProfileRelationResolvers = {
  Basespot: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Basespot();
  },
  Basespot_Basespot_updated_byToProfile: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .Basespot_Basespot_updated_byToProfile();
  },
  Message: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Message();
  },
  role_profile_role_idTorole: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .role_profile_role_idTorole();
  },
  Profile: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Profile();
  },
  other_Profile: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).other_Profile();
  },
  Role_Role_created_byToProfile: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .Role_Role_created_byToProfile();
  },
  TimelineSeason: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).TimelineSeason();
  },
  TimelineSeasonBasespot: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .TimelineSeasonBasespot();
  },
  TimelineSeasonEvent: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .TimelineSeasonEvent();
  },
  TimelineSeasonEvent_TimelineSeasonEvent_updated_byToProfile: (
    _obj,
    { root }
  ) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .TimelineSeasonEvent_TimelineSeasonEvent_updated_byToProfile();
  },
  TimelineSeasonPerson: (_obj, { root }) => {
    return db.profile
      .findUnique({ where: { id: root?.id } })
      .TimelineSeasonPerson();
  },
  Tribe: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).Tribe();
  },
  UserRecipe: (_obj, { root }) => {
    return db.profile.findUnique({ where: { id: root?.id } }).UserRecipe();
  },
};
