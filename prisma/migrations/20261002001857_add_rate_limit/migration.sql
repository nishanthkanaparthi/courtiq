-- CreateTable
CREATE TABLE "RateLimit" (
    "coachId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("coachId")
);
