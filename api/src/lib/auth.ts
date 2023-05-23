import { parseJWT, Decoded } from "@redwoodjs/api";
import { AuthenticationError, ForbiddenError } from "@redwoodjs/graphql-server";
import { db } from "./db";
import type { Profile as PrismaUser } from "@prisma/client";
import { Context } from "@redwoodjs/graphql-server/dist/functions/types";
import { permission } from "types/graphql";
import { logger } from "./logger";
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
    const { roles } = parseJWT({ decoded });
    // const currentUser =
    //   await db.$queryRaw`SELECT * FROM auth."users" WHERE id::text = ${decoded.sub};`;
    const { sub, role } = decoded;
    let user = await db.profile.findUnique({
      // include: { role_profile_role_idTorole: true },
      where: { id: sub.toString() },
    });
    if (user) {
      let role_id = user.role_id;
      return {
        id: sub as string,
        role_id,
        avatar_url: user.avatar_url,
        username: user.username,
        role,
        roles: [role_id, ...roles],
        ...decoded,
      };
    }

    return { ...decoded, roles };
  } catch (error) {
    return { id: decoded.sub.toString(), ...decoded };
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

  if (typeof role_id === "string") {
    if (typeof currentUserRoles === "string") {
      if (uuidCheck.test(role_id)) {
        return currentUserRoles === role_id;
      }
      let userRole: any = db.role.findUnique({
        where: { id: currentUserRoles },
      });
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

  // roles not found
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
    throw new AuthenticationError("You don't have access to do that.");
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
    where: { id: context.currentUser?.role_id },
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
  const t = db.$queryRaw`SELECT * FROM auth."roles" WHERE id::text = ${context.currentUser?.role_id};`;
  console.log(t);
  if (!permission) {
    throw new AuthenticationError(
      "You don't have the required permission to do that."
    );
  }
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.");
  }

  if (!hasPerm(permission)) {
    throw new ForbiddenError(
      `Your gallimimus outran the authorization process. Slow down!`
    );
  }
};
