/*
  Warnings:

  - You are about to drop the column `isReg` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT,
    "number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'created'
);
INSERT INTO "new_User" ("id", "login", "name", "number", "password", "role", "token") SELECT "id", "login", "name", "number", "password", "role", "token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
