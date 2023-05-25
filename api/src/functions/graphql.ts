import { authDecoder } from "@redwoodjs/auth-supabase-api";
import { createGraphQLHandler } from "@redwoodjs/graphql-server";

import directives from "src/directives/**/*.{js,ts}";
import sdls from "src/graphql/**/*.sdl.{js,ts}";
import services from "src/services/**/*.{js,ts}";

import { getCurrentUser } from "src/lib/auth";
import { db } from "src/lib/db";
import { logger } from "src/lib/logger";

const ipAddress = ({ event }) => {
  return (
    event?.headers?.["client-ip"] ||
    event?.requestContext?.identity?.sourceIp ||
    "localhost"
  );
};

const setIpAddress = async ({ event, context }) => {
  context.ipAddress = ipAddress({ event });
  return context;
};

export const handler = createGraphQLHandler({
  authDecoder,
  getCurrentUser,
  loggerConfig: {
    logger,
    options: {
      // operationName: false,
      // level: 'info
      // data: true,
      // tracing: true,
    },
  },
  defaultError: "An bruh moment occurred",
  directives,
  sdls,
  services,
  armorConfig: {
    maxDepth: {
      n: 5,
    },
  },
  context: setIpAddress,
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect();
  },
});
