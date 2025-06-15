/*
  Warnings:

  - The primary key for the `challenge_user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "challenge_user" DROP CONSTRAINT "challenge_user_pkey",
ADD CONSTRAINT "challenge_user_pkey" PRIMARY KEY ("user_id", "challenge_id", "created_at");
