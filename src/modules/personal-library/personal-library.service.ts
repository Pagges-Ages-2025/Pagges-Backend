import { Injectable, NotFoundException } from "@nestjs/common";

import { PaggesLogger } from "src/config/winston-logger/pagges-logger.utils";
import { PrismaService } from "../prisma/prisma.service";
import { BookshelfState } from "./dto/types";

@Injectable()
export class PersonalLibraryService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateOrCreateUserBookshelfState(
    user_id: number,
    book_id: number,
    new_state: BookshelfState
  ) {
    try {
      const result = await this.prismaService.userBookshelfState.upsert({
        where: {
          user_id_book_id: {
            user_id,
            book_id,
          },
        },
        update: {
          state: new_state,
        },
        create: {
          user_id,
          book_id,
          state: new_state,
        },
      });

      return {
        message:
          result.state === new_state
            ? "Biblioteca pessoal atualizada com sucesso"
            : "Livro adicionado à biblioteca pessoal com sucesso",
        data: result,
      };
    } catch (error) {
      PaggesLogger.error(
        `Error updating user bookshelf state: ${error.message}`
      );
      throw new Error("Failed to update user bookshelf state");
    }
  }

  async removeBookFromList(user_id: number, book_id: number) {
    // Verifica se existe um estado do livro na biblioteca do usuário
    const bookInLibrary =
      await this.prismaService.userBookshelfState.findUnique({
        where: {
          user_id_book_id: {
            user_id: user_id,
            book_id: book_id,
          },
        },
      });

    if (!bookInLibrary) {
      throw new NotFoundException(
        "Livro não encontrado na biblioteca do usuário"
      );
    }

    const remove = await this.prismaService.userBookshelfState.delete({
      where: {
        user_id_book_id: {
          user_id: user_id,
          book_id: book_id,
        },
      },
    });

    PaggesLogger.log(
      `Livro removido da biblioteca do usuário: ${user_id}, livro ID: ${book_id}`
    );

    return {
      message: "Livro removido da biblioteca do usuário com sucesso",
      data: remove,
    };
  }

  async getUserBookshelfByState(user_id: number, state: BookshelfState) {
    const userBookshelfByState =
      await this.prismaService.userBookshelfState.findMany({
        where: {
          user_id: user_id,
          state: state,
        },
        include: {
          book: {
            include: {
              ratings: {
                where: {
                  user_id: user_id,
                },
                select: {
                  rating: true,
                },
              },
            },
          },
        },
      });

    return userBookshelfByState.map((book_object) => {
      const book = book_object.book;

      const userRating =
        book.ratings.length > 0 ? book.ratings[0].rating : null;

      return {
        ...book_object,
        book,
        userRating,
      };
    });
  }

  async getUserStatistics(user_id: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        user_id: user_id,
      },
    });
    if (!user) throw new NotFoundException("usuário não encontrado");

    const arrayList = await this.prismaService.userBookshelfState.findMany({
      where: {
        user_id: user_id,
        state: "READ",
      },
      include: {
        book: true,
      },
    });

    const readBooks = arrayList.length;

    const readKms = arrayList.reduce((acc, item) => {
      return acc + (item.book?.pages ?? 0);
    }, 0);

    return { readBooks, readKms };
  }
}
