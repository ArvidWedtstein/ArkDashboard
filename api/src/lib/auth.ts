import { parseJWT, Decoded } from "@redwoodjs/api";
import {
  AuthenticationError,
  ForbiddenError,
  RedwoodGraphQLError,
} from "@redwoodjs/graphql-server";
import { db } from "./db";
import type { Profile as PrismaUser } from "@prisma/client";
import { permission } from "types/graphql";
/**
 * Represents the user attributes returned by the decoding the
 * Authentication provider's JWT together with an optional list of roles.
 */
type RedwoodUser = Record<string, any> & {
  id?: string;
  roles?: string[];
  email?: string;
  role_id?: string;
  avatar_url?: string;
  permissions?: string[];
  sub?: string;
  banned_until?: Date;
};

/**
 * getCurrentUser returns the user information together with
 * an optional collection of roles used by requireAuth() to check
 * if the user is authenticated or has role-based access
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the return object only once you've decided they are safe to be seen
 * if someone were to open the Web Inspector in their browser.
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 *
 * @param decoded - The decoded access token containing user info and JWT
 *   claims like `sub`. Note, this could be null.
 * @param { token, SupportedAuthTypes type } - The access token itself as well
 *   as the auth provider type
 * @param { APIGatewayEvent event, Context context } - An optional object which
 *   contains information from the invoker such as headers and cookies, and the
 *   context information about the invocation such as IP Address
 * @returns RedwoodUser
 */

export const getCurrentUser = async (
  decoded: Decoded
): Promise<RedwoodUser | null> => {
  try {
    if (context.currentUser) {
      return context.currentUser;
    }

    const user = await db.profile.findUnique({
      select: {
        id: true,
        updated_at: true,
        created_at: true,
        username: true,
        avatar_url: true,
        email: false,
        role_id: true,
        full_name: true,
        status: true,
        banned_until: true,
        role_profile_role_idTorole: {
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
      },
      // include: { role_profile_role_idTorole: true },
      where: { id: decoded.sub.toString() },
    });

    if (user.banned_until && user.banned_until > new Date()) {
      throw new AuthenticationError("You are banned");
    }
    return {
      ...user,
      permissions: user?.role_profile_role_idTorole?.permissions || [],
      roles: [
        ...parseJWT({ decoded: decoded }).roles,
        user.role_id,
        user?.role_profile_role_idTorole?.permissions,
      ],
      user_metadata: {
        roles: [user.role_id],
      },
    };
  } catch (error) {
    return {
      id: decoded.sub.toString(),
      roles: parseJWT({ decoded: decoded }).roles,
      user_metadata: {
        roles: parseJWT({ decoded: decoded }).roles,
      },
    };
  }
};

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!context.currentUser;
};

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enums too (if you're using them for roles), just import your enum type from `@prisma/client`
 */
type AllowedRoles = string | string[] | undefined;

/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param roles: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param role_id: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
export const hasRole = (role_id: AllowedRoles): boolean => {
  if (!isAuthenticated()) {
    return false;
  }
  // Regular expression to check if string is a valid UUID
  const uuidCheck =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  const currentUserRoles = context.currentUser?.role_id;
  // logger.warn("TEST", { currentUserRoles, role_id });
  if (typeof role_id === "string") {
    if (typeof currentUserRoles === "string") {
      if (uuidCheck.test(role_id)) {
        return currentUserRoles === role_id;
      }
      let userRole = db.role.findUnique({
        where: { id: currentUserRoles },
      }) as { name?: string; id?: string; permissions?: permission[] };
      return role_id === userRole?.name;
    }
    //  else if (Array.isArray(currentUserRoles)) {
    //   // roles to check is a string, currentUser.roles is an array
    //   return currentUserRoles?.some((allowedRole) => roles === allowedRole);
    // }
  }

  if (Array.isArray(role_id)) {
    if (Array.isArray(currentUserRoles)) {
      // roles to check is an array, currentUser.roles is an array
      return currentUserRoles?.some((allowedRole) =>
        role_id.includes(allowedRole)
      );
    } else if (typeof currentUserRoles === "string") {
      // roles to check is an array, currentUser.roles is a string
      return role_id.some((allowedRole) => currentUserRoles === allowedRole);
    }
  }

  return false;
};

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles?: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} - If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = async ({ roles }: { roles?: AllowedRoles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.");
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.");
    // throw new RedwoodGraphQLError("The error message", {
    //   code: "YOUR_INTERNAL_CODE",
    // });
  }
};

/**
 * Checks if the currentUser is authenticated (and assigned one of the given permissions)
 *
 * @param permission: {@link permission} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given permisson,
 * or when no permissons are provided to check against. Otherwise returns false.
 */
export const hasPerm = async (permission: permission) => {
  const userRole = await db.role.findUnique({
    where: { id: context.currentUser.roles[0] },
  });
  return userRole?.permissions.some((d) => d.includes(permission));
};

/**
 * Use hasPermission in your services to check that a user has permission,
 * error if they're not.
 *
 * @param permission?: {@link Permission} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser has permission (and assigned one of the given permissions)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} - If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const hasPermission = async ({
  permission,
}: {
  permission: permission;
}) => {
  if (!permission) {
    throw new AuthenticationError(
      "You don't have the required permission to do that."
    );
  }

  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.");
  }

  if (
    !context.currentUser.permissions?.some((d) => d.includes(permission))
    // || !hasPerm(permission)
  ) {
    throw new AuthenticationError(
      "Your gallimimus outran the authorization process. Slow down!"
    );
  }
};
