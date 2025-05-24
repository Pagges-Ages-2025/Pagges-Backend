/*
  Warnings:

  - You are about to drop the column `question` on the `alternative` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[genre_name]` on the table `genre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `answer` to the `alternative` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alternative" DROP COLUMN "question",
ADD COLUMN     "answer" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "challenge" ADD COLUMN     "is_current" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "genre_genre_name_key" ON "genre"("genre_name");
