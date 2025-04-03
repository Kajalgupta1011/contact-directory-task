-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'Unknown Company'
);
INSERT INTO "new_Card" ("companyName", "designation", "email", "id", "name", "phone") SELECT "companyName", "designation", "email", "id", "name", "phone" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE UNIQUE INDEX "Card_phone_key" ON "Card"("phone");
CREATE UNIQUE INDEX "Card_email_key" ON "Card"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
