import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PaggesLogger } from "src/config/winston-logger/pagges-logger.utils";
import { PrismaService } from "../prisma/prisma.service";
import { ChallengeRequestDto } from "./dto/challenge.dto";

@Injectable()
export class ChallengesService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.initializeRandomChallenge();
  }

  private async initializeRandomChallenge() {
    try {
      // First, ensure all challenges are set to not current
      await this.prisma.challenge.updateMany({
        where: { is_current: true },
        data: { is_current: false },
      });

      // Get total count of challenges
      const totalChallenges = await this.prisma.challenge.count();

      if (totalChallenges === 0) {
        PaggesLogger.warn("No challenges found in the database");
        return;
      }

      // Generate random offset
      const randomOffset = Math.floor(Math.random() * totalChallenges);

      // Get random challenge
      const randomChallenge = await this.prisma.challenge.findFirst({
        skip: randomOffset,
        select: {
          challenge_id: true,
          question: true,
        },
      });

      if (!randomChallenge) {
        PaggesLogger.error("Failed to select random challenge");
        return;
      }

      // Set the random challenge as current
      await this.prisma.challenge.update({
        where: { challenge_id: randomChallenge.challenge_id },
        data: { is_current: true },
      });

      PaggesLogger.log(
        `Initialized random challenge: ${randomChallenge.question}, ID: ${randomChallenge.challenge_id}`
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      PaggesLogger.error(
        `Failed to initialize random challenge: ${errorMessage}`
      );
    }
  }

  async getAllChallenges() {
    return await this.prisma.challenge.findMany({
      include: { alternatives: true },
    });
  }

  async getChallengeById(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { challenge_id: Number(id) },
      include: { alternatives: true },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    return challenge;
  }

  async createChallenge(challenge: ChallengeRequestDto) {
    return await this.prisma.challenge.create({
      data: {
        points: challenge.points,
        question: challenge.question,
        alternatives: {
          create: challenge.alternatives,
        },
      },
      include: { alternatives: true },
    });
  }

  async deleteChallenge(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { challenge_id: Number(id) },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    return await this.prisma.challenge.delete({
      where: { challenge_id: Number(id) },
    });
  }

  // Triggered by cron every day
  async updateCurrentChallenge() {
    return await this.prisma.$transaction(async (prisma) => {
      // Get current challenge with a more specific query
      const currentChallenge = await prisma.challenge.findFirst({
        where: { is_current: true },
        select: {
          challenge_id: true,
          question: true,
        },
      });

      if (!currentChallenge) {
        PaggesLogger.error("No active challenge found");
        throw new NotFoundException("No active challenge found");
      }

      // Update current challenge to inactive
      await prisma.challenge.update({
        where: { challenge_id: currentChallenge.challenge_id },
        data: { is_current: false },
      });

      // Get the next challenge ID
      const nextChallengeId = currentChallenge.challenge_id + 1;
      // Find the next challenge
      const nextChallenge = await prisma.challenge.findFirst({
        where: {
          challenge_id: nextChallengeId,
        },
        select: {
          challenge_id: true,
          question: true,
        },
      });

      // If next challenge exists, make it current
      if (nextChallenge) {
        await prisma.challenge.update({
          where: { challenge_id: nextChallenge.challenge_id },
          data: { is_current: true },
        });
        PaggesLogger.log(
          `Updated current challenge to: ${nextChallenge.question}, ID: ${nextChallenge.challenge_id}`
        );
        return nextChallenge;
      }

      // If no next challenge, get the first challenge
      const firstChallenge = await prisma.challenge.findFirst({
        where: { challenge_id: 1 },
        select: {
          challenge_id: true,
          question: true,
        },
      });

      if (!firstChallenge) {
        PaggesLogger.error("No challenges found in the system");
        throw new NotFoundException("No challenges found in the system");
      }

      // Make first challenge current
      await prisma.challenge.update({
        where: { challenge_id: firstChallenge.challenge_id },
        data: { is_current: true },
      });

      PaggesLogger.log(`Reset to first challenge: ${firstChallenge.question}`);
      return firstChallenge;
    });
  }
}
