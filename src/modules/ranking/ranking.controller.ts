import { Controller, Get, HttpCode } from "@nestjs/common";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { RankingService } from "./ranking.service";

@Controller("ranking")
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @HttpCode(200)
  getProfile(@UserTokenInfo() userInfo: JwtPayload) {
    return this.rankingService.getRanking();
  }

  @Get("getRankingMe")
  getUserStatistics(@UserTokenInfo() userInfo: JwtPayload) {
    return this.rankingService.getRankingMe(userInfo.id);
  }
}