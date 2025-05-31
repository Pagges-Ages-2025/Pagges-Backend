import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { UserFollowDto } from "./dto/user-follow.dto";
import { UserUnfollowDto } from "./dto/user-unfollow.dto";
import { SocialService } from "./social.service";

@Controller("social")
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post("follow")
  @HttpCode(201)
  @ApiOperation({ summary: "Seguir um usuário" })
  @ApiResponse({ status: 201, description: "Usuário seguido com sucesso" })
  @ApiResponse({
    status: 400,
    description: "Erro de validação ou usuário já seguido",
  })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  followuser(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() followUserDto: UserFollowDto
  ) {
    return this.socialService.followUser(userInfo.id, followUserDto.username);
  }

  @Delete("unfollow")
  @HttpCode(204)
  @ApiOperation({ summary: "Deixar de seguir um usuário" })
  @ApiResponse({
    status: 204,
    description: "Deixou de seguir o usuário com sucesso",
  })
  @ApiResponse({
    status: 400,
    description:
      "Usuário não estava sendo seguido ou você não pode deixar de seguir você mesmo",
  })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  unfollowUser(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() unfollowUserDto: UserUnfollowDto
  ) {
    return this.socialService.unfollowUser(
      userInfo.id,
      unfollowUserDto.username
    );
  }

  @Get("is-following")
  isFollowing(
    @UserTokenInfo() userInfo: JwtPayload,
    @Query("username") username: string
  ){
    if(!username) {
      throw new BadRequestException("username está vazio");
    }
    return this.socialService.isFollowing(userInfo.id, username);
  }
}
