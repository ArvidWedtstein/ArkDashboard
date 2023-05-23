import {
  AuthenticationError,
  createValidatorDirective,
  ValidatorDirectiveFunc,
} from "@redwoodjs/graphql-server";
import { hasPermission as applicationHasPermission } from "src/lib/auth";
import { logger } from "src/lib/logger";
import { permission } from "types/graphql";

export const schema = gql`
  """
  Use @hasPermission to validate access to a field, query or mutation.
  """
  directive @hasPermission(permission: String!) on FIELD_DEFINITION
`;

type RequirePermissionValidate = ValidatorDirectiveFunc<{
  permission: permission;
}>;

const validate: RequirePermissionValidate = ({ directiveArgs }) => {
  /**
   * Write your validation logic inside this function.
   * Validator directives do not have access to the field value, i.e. they are called before resolving the value
   *
   * - Throw an error, if you want to stop executing e.g. not sufficient permissions
   * - Validator directives can be async or sync
   * - Returned value will be ignored
   */

  // currentUser is only available when auth is setup.
  // logger.debug({ directiveArgs }, "currentUser in hasPermission directive");

  // You can also modify your directive to take arguments
  // and use the directiveArgs object provided to this function to get values
  // See documentation here: https://redwoodjs.com/docs/directives

  const { permission } = directiveArgs;
  applicationHasPermission({ permission });
};

const hasPermission = createValidatorDirective(schema, validate);

export default hasPermission;
