import { Controller, Get, Body, Query } from '@nestjs/common'
import { UserSearchService } from './user-search.service'
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from 'src/interfaces/user-info.interface'
import { GetUserInfosDto } from './dto/get_user_infos.dto';

@Controller('user-search')
export class UserSearchController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Get('getUserInfos')
  getUserInformations(@UserTokenInfo() userInfo: JwtPayload, @Body() dto: GetUserInfosDto) {
    return this.userSearchService.getUserInfos(userInfo.id, dto)
  }

  @Get('user')
    findUsersByName(@Query('name') name: string) {
      return this.userSearchService.findUsersByName(name)
    }
}
