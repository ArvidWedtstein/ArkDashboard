-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Basespot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Map" TEXT,
    "EstimatedForPlayers" TEXT NOT NULL DEFAULT '0'
);
INSERT INTO "new_Basespot" ("Map", "createdAt", "description", "id", "image", "latitude", "longitude", "name") SELECT "Map", "createdAt", "description", "id", "image", "latitude", "longitude", "name" FROM "Basespot";
DROP TABLE "Basespot";
ALTER TABLE "new_Basespot" RENAME TO "Basespot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
