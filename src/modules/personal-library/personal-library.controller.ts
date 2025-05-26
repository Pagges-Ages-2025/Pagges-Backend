import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
} from "@nestjs/common";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { UpdateOrCreateBookInUserBookshelf } from "./dto/create-or-update-book-to-bookshelf";
import { DeleteBookInUserBookshelf } from "./dto/delete-book-in-bookshelf";
import { BookshelfState } from "./dto/types";
import { PersonalLibraryService } from "./personal-library.service";

@Controller("personal-library")
export class PersonalLibraryController {
  constructor(private readonly personalLibrary: PersonalLibraryService) {}

  @Post("addBook")
  updateOrCreateBookInUserBookshelf(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() dto: UpdateOrCreateBookInUserBookshelf
  ) {
    return this.personalLibrary.updateOrCreateUserBookshelfState(
      userInfo.id,
      dto.bookId,
      dto.state
    );
  }

  @Delete("removeBook")
  @HttpCode(204)
  removeBookFromUserBookshelf(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() dto: DeleteBookInUserBookshelf
  ) {
    return this.personalLibrary.removeBookFromList(userInfo.id, dto.bookId);
  }

  @Get("getBookshelfByState")
  async getBookshelfByState(
    @UserTokenInfo() userInfo: JwtPayload,
    @Query("category") category: BookshelfState
  ) {
    return await this.personalLibrary.getUserBookshelfByState(
      userInfo.id,
      category
    );
  }

  @Get("getUserStatistics")
  getUserStatistics(@UserTokenInfo() userInfo: JwtPayload) {
    return this.personalLibrary.getUserStatistics(userInfo.id);
  }
}
