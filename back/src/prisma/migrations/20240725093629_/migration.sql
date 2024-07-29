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
    "isReg" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "isReg", "login", "name", "number", "password", "role", "token") SELECT "id", coalesce("isReg", false) AS "isReg", "login", "name", "number", "password", "role", "token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
