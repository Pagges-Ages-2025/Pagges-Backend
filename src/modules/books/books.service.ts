import { Injectable, NotFoundException } from "@nestjs/common";
import { PaggesLogger } from "src/config/winston-logger/pagges-logger.utils";
import { PrismaService } from "../prisma/prisma.service";
import { BookRatingDto } from "./dto/book-rating.dto";
import { BookToRegisterDto } from "./dto/book-to-register.dto";

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getAverageRateBook(id: number) {
    const avaregeRating = await this.prisma.rateBook.aggregate({
      where: { book_id: id },
      _avg: { rating: true },
    });

    if (avaregeRating._avg.rating === null) {
      throw new NotFoundException(
        "Nenhuma avaliação encontrada para esse livro."
      );
    }

    return {
      status: 200,
      message: "avaliações encontradas com sucesso.",
      data: Math.round(avaregeRating._avg.rating),
    };
  }

  async postRatingBook(user_id: number, dto: BookRatingDto) {
    const book = await this.prisma.book.findUnique({
      where: {
        book_id: dto.book_id,
      },
    });

    if (!book) {
      throw new NotFoundException("Livro não encontrado");
    }

    const alreadyRated = await this.prisma.rateBook.findFirst({
      where: {
        user_id: user_id,
        book_id: dto.book_id,
      },
    });

    let rating;

    if (alreadyRated) {
      rating = await this.prisma.rateBook.update({
        where: {
          user_id_book_id: {
            user_id: user_id,
            book_id: dto.book_id,
          },
        },
        data: {
          rating: dto.rating,
        },
      });

      return {
        message: "Avaliação atualizada com sucesso",
        rating,
      };
    } else {
      rating = await this.prisma.rateBook.create({
        data: {
          user_id: user_id,
          book_id: dto.book_id,
          rating: dto.rating,
        },
      });

      return {
        message: "Avaliação criada com sucesso",
        rating,
      };
    }
  }

  async getBookScreen(book_id: number) {
    const bookInfo = await this.prisma.book.findUnique({
      where: {
        book_id: book_id,
      },
    });

    if (!bookInfo) {
      throw new NotFoundException("Livro não encontrado");
    }

    const bookByAuthor = await this.prisma.book.findMany({
      where: {
        authors: bookInfo?.authors,
      },
    });

    return [bookInfo, bookByAuthor];
  }

  async registerBookInDatabase(book: BookToRegisterDto) {
    if (book.generos) {
      for (const genre of book.generos) {
        const result = await this.prisma.genre.findFirst({
          where: {
            genre_name: genre,
          },
        });

        if (result == null) {
          await this.prisma.genre.create({
            data: {
              genre_name: genre,
            },
          });
          PaggesLogger.log(`Gênero ${genre} criado com sucesso.`);
        } else {
          PaggesLogger.warn(
            `Gênero ${genre} já existe no banco de dados. Não será criado novamente.`
          );
        }
      }
    }

    const existingBook = await this.prisma.book.findFirst({
      where: {
        google_book_id: book.google_book_id,
      },
    });

    if (existingBook) {
      PaggesLogger.log(
        `Livro ${book.titulo} já existe no banco de dados. Não será criado novamente.`
      );
      return {
        data: existingBook,
        message: "Livro já existe no banco de dados.",
        status: 200,
      };
    }

    const newBook = await this.prisma.book.create({
      data: {
        google_book_id: book.google_book_id,
        title: book.titulo,
        authors: book.autores.join(", "),
        pages: book.paginas,
        synopsis: book.sinopse,
        year: parseInt(book.anoDePublicacao),
        google_image_url: book.google_image_url,
        BookGenre: {
          create:
            book.generos?.map((genre) => ({
              genre: {
                connect: { genre_name: genre },
              },
            })) ?? [],
        },
      },
    });

    PaggesLogger.log(
      `Livro ${book.titulo} registrado com sucesso. ID: ${newBook.book_id}`
    );

    return {
      message: "Livro registrado com sucesso.",
      status: 201,
      data: newBook,
    };
  }

  async getTrendingBooks() {
    const ratedBooks = await this.prisma.rateBook.groupBy({
      by: ["book_id"],
      _avg: {
        rating: true,
      },
      having: {
        rating: {
          _avg: {
            gt: 4,
          },
        },
      },
    });

    if (!ratedBooks || ratedBooks.length === 0) {
      throw new NotFoundException("Nenhum livro bem avaliado encontrado");
    }

    const bookIds = ratedBooks.map((b) => b.book_id);

    const avgRatingMap = new Map<number, number>(
      ratedBooks.map((b) => [b.book_id, b._avg.rating ?? 0])
    );

    const trendingBooks = await this.prisma.book.findMany({
      where: {
        book_id: {
          in: bookIds,
        },
      },
      include: {
        ratings: true,
      },
      take: 10,
    });

    if (!trendingBooks || trendingBooks.length === 0) {
      throw new NotFoundException("Nenhum livro em alta encontrado");
    }

    const booksWithAvg = trendingBooks.map((book) => ({
      ...book,
      averageRating: avgRatingMap.get(book.book_id) ?? null,
    }));

    return booksWithAvg;
  }
}
