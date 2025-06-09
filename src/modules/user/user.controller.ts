import { Controller, Get, Query } from "@nestjs/common";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("searchByName")
  findUsersByName(
    @Query("name") name: string,
    @UserTokenInfo() userInfo: JwtPayload
  ) {
    return this.userService.findUsersByName(name, userInfo.id);
  }
}
