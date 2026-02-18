-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Application_isFavorite_idx" ON "Application"("isFavorite");

-- CreateIndex
CREATE INDEX "Application_isArchived_idx" ON "Application"("isArchived");
