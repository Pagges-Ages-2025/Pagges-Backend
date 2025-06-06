import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { UserFollowDto } from "./dto/user-follow.dto";
import { UserUnfollowDto } from "./dto/user-unfollow.dto";
import { SocialService } from "./social.service";
import { get } from "http";

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
  @Get("follower")
  @HttpCode(200)
  @ApiOperation({ summary: "Listar usuários que estou seguindo" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuários seguidos retornada com sucesso",
  })
  getFollower(@UserTokenInfo() userInfo: JwtPayload) {
    return this.socialService.getFollower(userInfo.id);
  }

  @Get("followers/:secondaryUserId")
  @HttpCode(200)
  @ApiOperation({
    summary:
      "Listar seguidores de outro usuário e verificar se me seguem de volta",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de seguidores retornada com sucesso",
  })
  getOthersFollower(
    @UserTokenInfo() primaryUserInfo: JwtPayload,
    @Param("secondaryUserId") secondaryUserId: number
  ) {
    return this.socialService.getOthersFollowers(
      primaryUserInfo.id,
      secondaryUserId
    );
  }
}
