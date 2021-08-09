-- CreateTable
CREATE TABLE "sessions" (
    "_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'bearer',
    "expires_in" INTEGER NOT NULL,
    "logged_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT NOT NULL,
    "inactivated_at" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users" ("_id") ON DELETE CASCADE ON UPDATE CASCADE
);
