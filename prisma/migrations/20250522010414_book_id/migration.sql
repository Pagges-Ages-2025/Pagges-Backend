/*
  Warnings:

  - You are about to drop the column `isbn` on the `book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_book_id]` on the table `book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `google_book_id` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "book_isbn_key";

-- AlterTable
CREATE SEQUENCE book_book_id_seq;
ALTER TABLE "book" DROP COLUMN "isbn",
ADD COLUMN     "google_book_id" TEXT NOT NULL,
ALTER COLUMN "book_id" SET DEFAULT nextval('book_book_id_seq');
ALTER SEQUENCE book_book_id_seq OWNED BY "book"."book_id";

-- CreateIndex
CREATE UNIQUE INDEX "book_google_book_id_key" ON "book"("google_book_id");
