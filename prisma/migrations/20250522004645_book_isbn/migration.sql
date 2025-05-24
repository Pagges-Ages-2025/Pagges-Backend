/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `book` will be added. If there are existing duplicate values, this will fail.
  - Made the column `isbn` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "book" ALTER COLUMN "isbn" SET NOT NULL,
ALTER COLUMN "isbn" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");
