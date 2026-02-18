/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "createdAt",
ADD COLUMN     "aiAdvice" TEXT[],
ADD COLUMN     "aiArticles" JSONB,
ADD COLUMN     "aiCourses" JSONB,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "resume" TEXT,
ADD COLUMN     "skills" TEXT[];

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
