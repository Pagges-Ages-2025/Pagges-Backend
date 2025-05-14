import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UserTokenInfo } from 'src/decorators/user-info.decorator'
import { JwtPayload } from 'src/interfaces/user-info.interface'
import { PostDto } from './dto/post.dto'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Buscar os posts mais recentes de um usuário' })
  @ApiResponse({ status: 200, description: 'Busca realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao realizar busca' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  @Get('user-recent-reviews')
  @HttpCode(200)
  getRecentReviewsFromUser(@UserTokenInfo() userInfo: JwtPayload) {
    return this.postsService.getRecentReviewsFromUser(userInfo.id)
  }

  @Post('create-new-post')
  @HttpCode(201)
  postCreateNewPost(
    @Body() dto: PostDto,
    @UserTokenInfo() userInfo: JwtPayload,
  ) {
    return this.postsService.createNewPost(dto, userInfo.id)
  }

  @Get('reviews/:livroId')
  @HttpCode(200)
  getReviews(@Param('livroId', ParseIntPipe) livroId: number) {
    return this.postsService.getBookReviews(livroId)
  }
}
