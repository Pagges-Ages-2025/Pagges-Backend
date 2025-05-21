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
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { ChallengesService } from "./challenges.service";
import { ChallengeRequestDto } from "./dto/challenge.dto";
import { UpdateUserPointsDto } from "./dto/update_user_points.dto";

@Controller("challenges")
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get("all")
  @HttpCode(200)
  async getAllChallenges() {
    return await this.challengesService.getAllChallenges();
  }

  @Get(":id")
  @HttpCode(200)
  async getChallengeById(@Param("id") id: string) {
    return await this.challengesService.getChallengeById(id);
  }

  @Get("get-current")
  @HttpCode(200)
  async getCurrentChallenge() {
    return await this.challengesService.getCurrentChallenge();
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

  @Post("challenge-answer")
  async updateUserPoints(
    @UserTokenInfo() jwtPayload: JwtPayload,
    @Body() updateUserBody: UpdateUserPointsDto
  ) {
    return await this.challengesService.updateUserPoints(
      jwtPayload.id,
      updateUserBody
    );
  }
}
