// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from "@prisma/client";

import { emitLogLevels, handlePrismaLogging } from "@redwoodjs/api/logger";

import { logger } from "./logger";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error
// BigInt.prototype.toJSON = function (): string {
//   return this.toString();
// };
/*
 * Instance of the Prisma Client
 */
export const db = new PrismaClient({
  errorFormat: "pretty",
  log: emitLogLevels(["info", "warn", "error"]),
});

handlePrismaLogging({
  db,
  logger,
  logLevels: ["info", "warn", "error"],
});
