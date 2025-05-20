import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PaggesLogger } from "src/config/winston-logger/pagges-logger.utils";
import { ChallengesService } from "./challenges.service";
import { ChallengeRequestDto } from "./dto/challenge.dto";

@Controller("challenges")
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get("all")
  @HttpCode(200)
  async getAllChallenges() {
    return await this.challengesService.getAllChallenges();
  }

  @Get("get/:id")
  @HttpCode(200)
  async getChallengeById(@Param("id") id: string) {
    return await this.challengesService.getChallengeById(id);
  }

  @Post("create")
  @HttpCode(201)
  async createChallenge(@Body() challenge: ChallengeRequestDto) {
    return await this.challengesService.createChallenge(challenge);
  }

  @Delete("delete/:id")
  @HttpCode(204)
  async deleteChallenge(@Param("id") id: string) {
    return await this.challengesService.deleteChallenge(id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateCurrentChallenge() {
    try {
      await this.challengesService.updateCurrentChallenge();
    } catch (error) {
      PaggesLogger.error(
        `An error occurred when trying to update the daily challenge. Error: ${error}`
      );
    }
  }
}
