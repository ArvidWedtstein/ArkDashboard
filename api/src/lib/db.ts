// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from "@prisma/client";

import { emitLogLevels, handlePrismaLogging } from "@redwoodjs/api/logger";

import { logger } from "./logger";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unreachable code error

BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
/*
 * Instance of the Prisma Client
 */
export const db = new PrismaClient({
  // errorFormat: "minimal",
  errorFormat: "pretty",
  log: emitLogLevels(["info", "warn", "error"]), // [{ emit: 'stdout', level: 'warn' }, { emit: 'stdout', level: 'error' }, { emit: 'stdout', level: 'info' }]
});

handlePrismaLogging({
  db,
  logger,
  logLevels: ["info", "warn", "error"],
});
