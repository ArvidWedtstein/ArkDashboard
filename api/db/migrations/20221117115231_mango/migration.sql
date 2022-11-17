/*
  Warnings:

  - The primary key for the `UserCredential` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserCredential` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCredential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "publicKey" BLOB NOT NULL,
    "transports" TEXT,
    "counter" BIGINT NOT NULL,
    CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCredential" ("counter", "id", "publicKey", "transports", "userId") SELECT "counter", "id", "publicKey", "transports", "userId" FROM "UserCredential";
DROP TABLE "UserCredential";
ALTER TABLE "new_UserCredential" RENAME TO "UserCredential";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
