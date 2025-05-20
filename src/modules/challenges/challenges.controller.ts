import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ChallengesService } from "./challenges.service";
import { ChallengeDto, ChallengeRequestDto } from "./dto/challenge.dto";

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly ChallengesService: ChallengesService) {}

  @Get('all')
  getAllChallenges() {
    return this.ChallengesService.getAllChallenges()
  }

  @Get('get/:id')
  getChallengeById(@Param('id') id: string) {
    return this.ChallengesService.getChallengeById(id)
  }

  @Post('create')
  createChallenge(@Body() challenge: ChallengeRequestDto) {
    return this.ChallengesService.createChallenge(challenge)
  }

  @Delete('remove/:id')
  removeChallenge(@Param('id') id: string) {
    return this.ChallengesService.removeChallenge(id)
  }
}
