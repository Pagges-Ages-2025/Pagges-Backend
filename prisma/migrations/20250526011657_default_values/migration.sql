/*
  Warnings:

  - Made the column `points` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pages` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "points" SET NOT NULL,
ALTER COLUMN "points" SET DEFAULT 0,
ALTER COLUMN "pages" SET NOT NULL,
ALTER COLUMN "pages" SET DEFAULT 0;
