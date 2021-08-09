/*
  Warnings:

  - You are about to drop the column `ip_address` on the `sessions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sessions" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'bearer',
    "expires_in" INTEGER NOT NULL,
    "logged_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inactivated_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users" ("_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_sessions" ("_id", "expires_in", "inactivated_at", "is_active", "logged_at", "token", "type", "user_id") SELECT "_id", "expires_in", "inactivated_at", "is_active", "logged_at", "token", "type", "user_id" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
