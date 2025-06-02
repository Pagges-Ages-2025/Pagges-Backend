/*
  Warnings:

  - Made the column `year` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pages` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `authors` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `google_image_url` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "book" ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "pages" SET NOT NULL,
ALTER COLUMN "authors" SET NOT NULL,
ALTER COLUMN "google_image_url" SET NOT NULL;
