import { IsNumber } from "class-validator";

export class DeleteBookInUserBookshelf {
  @IsNumber()
  bookId: number;
}
