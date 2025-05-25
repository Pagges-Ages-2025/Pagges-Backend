import { IsEnum, IsNumber } from "class-validator";
import { BookshelfState } from "./types";

export class UpdateOrCreateBookInUserBookshelf {
  @IsNumber()
  bookId: number;

  @IsEnum(BookshelfState)
  state: BookshelfState;
}
