/*
  Warnings:

  - Added the required column `has_user_guessed_correctly` to the `challenge_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenge_user" ADD COLUMN     "has_user_guessed_correctly" BOOLEAN NOT NULL;
