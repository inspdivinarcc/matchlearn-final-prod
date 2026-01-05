-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MentorshipSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mentorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "duration" INTEGER,
    "cost" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MentorshipSession_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MentorshipSession_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MentorshipSession" ("cost", "createdAt", "duration", "id", "mentorId", "studentId") SELECT "cost", "createdAt", "duration", "id", "mentorId", "studentId" FROM "MentorshipSession";
DROP TABLE "MentorshipSession";
ALTER TABLE "new_MentorshipSession" RENAME TO "MentorshipSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
