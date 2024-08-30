/*
  Warnings:

  - You are about to drop the column `ip` on the `Logger` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Logger` table. All the data in the column will be lost.
  - Added the required column `serverIp` to the `Logger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceIp` to the `Logger` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Logger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serverIp" TEXT NOT NULL,
    "sourceIp" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Logger" ("context", "desc", "id", "time") SELECT "context", "desc", "id", "time" FROM "Logger";
DROP TABLE "Logger";
ALTER TABLE "new_Logger" RENAME TO "Logger";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
