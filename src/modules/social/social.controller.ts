import { Body, Controller, HttpCode, Patch, Post } from "@nestjs/common";
import { SocialService } from "./social.service";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("social")
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Seguir um usuário" })
  @ApiResponse({ status: 201, description: "Usuário seguido com sucesso" })
  @ApiResponse({
    status: 400,
    description: "Erro de validação ou usuário já seguido",
  })
  @ApiResponse({ status: 401, description: "Usuário não encontrado" })
  followuser(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() followUserDto: { username: string },
  ) {
    return this.socialService.followUser(userInfo.id, followUserDto.username);
  }

  @Patch("unfollow")
  @HttpCode(200)
  @ApiOperation({ summary: "Deixar de seguir um usuário" })
  @ApiResponse({
    status: 200,
    description: "Deixou de seguir o usuário com sucesso",
  })
  @ApiResponse({ status: 400, description: "Usuário não estava sendo seguido" })
  unfollowUser(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() unfollowUserDto: { username: string },
  ) {
    return this.socialService.unfollowUser(
      userInfo.id,
      unfollowUserDto.username,
    );
  }
}
