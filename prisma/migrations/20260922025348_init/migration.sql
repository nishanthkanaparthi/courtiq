-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "coachId" TEXT,
    "opponentName" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "sets" JSONB NOT NULL,
    "currentSetIndex" INTEGER NOT NULL,
    "currentGameIndex" INTEGER NOT NULL,
    "winner" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatEntry" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "statTypeId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "pointNumber" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Match_playerId_idx" ON "Match"("playerId");

-- CreateIndex
CREATE INDEX "StatEntry_matchId_idx" ON "StatEntry"("matchId");

-- AddForeignKey
ALTER TABLE "StatEntry" ADD CONSTRAINT "StatEntry_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
