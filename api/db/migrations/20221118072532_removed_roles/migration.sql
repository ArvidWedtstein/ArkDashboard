/*
  Warnings:

  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `RoleId` on the `user` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "role";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "webAuthnChallenge" TEXT,
    "roles" TEXT NOT NULL DEFAULT 'PEASANT'
);
INSERT INTO "new_user" ("email", "hashedPassword", "id", "resetToken", "resetTokenExpiresAt", "salt", "webAuthnChallenge") SELECT "email", "hashedPassword", "id", "resetToken", "resetTokenExpiresAt", "salt", "webAuthnChallenge" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE UNIQUE INDEX "user_webAuthnChallenge_key" ON "user"("webAuthnChallenge");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
