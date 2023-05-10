// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from "@prisma/client";

import { emitLogLevels, handlePrismaLogging } from "@redwoodjs/api/logger";

import { logger } from "./logger";

/*
 * Instance of the Prisma Client
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};
export const db = new PrismaClient({
  log: emitLogLevels(["info", "warn", "error", "query"]),
});

handlePrismaLogging({
  db,
  logger,
  logLevels: ["info", "warn", "error", "query"],
});
