-- CreateTable
CREATE TABLE "FetchableArticle" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "source" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FetchableArticle_pkey" PRIMARY KEY ("id")
);
