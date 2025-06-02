import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserTokenInfo } from "src/decorators/user-info.decorator";
import { JwtPayload } from "src/interfaces/user-info.interface";
import { BooksService } from "./books.service";
import { BookRatingDto } from "./dto/book-rating.dto";
import { BookToRegisterDto } from "./dto/book-to-register.dto";

@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({ summary: "Avaliar um livro" })
  @ApiResponse({
    status: 200,
    description: "Avaliação do livro criada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Erro ao criar avaliação do livro" })
  @ApiResponse({ status: 401, description: "Usuário não autenticado" })
  @ApiResponse({ status: 404, description: "Livro não encontrado" })
  @Post("rate-book")
  @HttpCode(201)
  postRatingBook(
    @UserTokenInfo() userInfo: JwtPayload,
    @Body() dto: BookRatingDto
  ) {
    return this.booksService.postRatingBook(userInfo.id, dto);
  }

  @Get("avarageRankBook/:id")
  @HttpCode(200)
  getAverageRateByBookId(@Param("id", ParseIntPipe) id: number) {
    return this.booksService.getAverageRateBook(id);
  }

  @Get("getBookScreen/:bookId")
  getBookScreen(@Param("bookId", ParseIntPipe) bookId: number) {
    return this.booksService.getBookScreen(bookId);
  }

  @Post("register")
  @HttpCode(201)
  async registerBookInDatabase(@Body() book: BookToRegisterDto) {
    return await this.booksService.registerBookInDatabase(book);
  }

  @Get('trending')
  gerTrendingBooks() {
    return this.booksService.getTrendingBooks();
  }

  @Post('genres')
  async getBooksByGenres(@Body('genres') genres: string[]) {
    return this.booksService.getBooksByMultipleGenres(genres);
  }
}
