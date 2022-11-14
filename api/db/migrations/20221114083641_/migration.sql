/*
  Warnings:

  - A unique constraint covering the columns `[webAuthnChallenge]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "webAuthnChallenge" TEXT;

-- CreateTable
CREATE TABLE "UserCredential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "publicKey" BLOB NOT NULL,
    "transports" TEXT,
    "counter" BIGINT NOT NULL,
    CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_webAuthnChallenge_key" ON "User"("webAuthnChallenge");
