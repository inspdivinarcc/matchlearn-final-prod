-- AlterTable
ALTER TABLE "Battle" ADD COLUMN "answerId" TEXT;
ALTER TABLE "Battle" ADD COLUMN "correctAnswerId" TEXT;
ALTER TABLE "Battle" ADD COLUMN "questionId" TEXT;

-- CreateTable
CREATE TABLE "PendingMint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeType" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PendingMint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
