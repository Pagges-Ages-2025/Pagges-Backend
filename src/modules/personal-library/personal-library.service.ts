import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { BookshelfState } from '@prisma/client';
import { GoogleIntegrationService } from '../google-integration/google-integration.service';
import { PaggesLogger } from 'src/config/winston-logger/pagges-logger.utils';

@Injectable()
export class PersonalLibraryService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly googleIntegrationService: GoogleIntegrationService
    ) { }

    // Função para converter ID string do Google Books em um número (hash simples)
    private hashStringToNumber(str: string): number {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        // Garantir que seja positivo e evitar colisões com IDs existentes
        return Math.abs(hash % 1000000) + 10000;
    }
    
    // Função para truncar texto que exceda o limite do banco de dados
    private truncateText(text: string | null | undefined, maxLength: number): string | null {
        if (!text) return null;
        return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    }

    async addBookToList(user_id: number, book_id: number | string, listToAdd: BookshelfState) {
        const user = await this.prismaService.user.findFirst({
            where: {
                user_id: user_id,
            }
        })
        if (!user) throw new NotFoundException('usuário não encontrado')

        // Para IDs do Google Books (que são strings alfanuméricas)
        const isGoogleBookId = typeof book_id === 'string' && isNaN(Number(book_id));
        const numericBookId = isGoogleBookId ? this.hashStringToNumber(book_id as string) : Number(book_id);
        
        PaggesLogger.log(`Processando livro: ID original=${book_id}, isGoogleBookId=${isGoogleBookId}, numericBookId=${numericBookId}`);

        // Verifica se o livro existe no banco de dados
        let book = await this.prismaService.book.findUnique({
            where: {
                book_id: numericBookId,
            }
        });

        // Se o livro não existir, busca na API do Google
        if (!book) {
            try {
                // Busca informações do livro na API do Google Books
                const googleBookId = isGoogleBookId ? book_id as string : String(book_id);
                PaggesLogger.log(`Buscando livro na API do Google: ${googleBookId}`);
                
                const googleBookData = await this.googleIntegrationService.getBookById(googleBookId);
                
                // Trata os campos limitados pelo tamanho da coluna no banco de dados
                const truncatedTitle = this.truncateText(googleBookData.title, 250);
                const truncatedGenre = this.truncateText(googleBookData.genre, 250);
                const truncatedAuthors = this.truncateText(googleBookData.authors, 250);
                const truncatedCover = this.truncateText(googleBookData.cover, 990);
                const truncatedImageUrl = this.truncateText(googleBookData.google_image_url, 990);
                const truncatedSynopsis = this.truncateText(googleBookData.synopsis, 990);
                
                // Cria o livro no banco de dados com as informações do Google Books
                book = await this.prismaService.book.create({
                    data: {
                        book_id: numericBookId,
                        isbn: null,
                        title: truncatedTitle,
                        genre: truncatedGenre,
                        authors: truncatedAuthors,
                        cover: truncatedCover,
                        google_image_url: truncatedImageUrl,
                        synopsis: truncatedSynopsis,
                        year: parseInt(googleBookData.year) || new Date().getFullYear(),
                        pages: googleBookData.pages
                    }
                });
                
                PaggesLogger.log(`Livro criado no banco de dados: ID=${numericBookId}, Título=${truncatedTitle}`);
            } catch (error) {
                PaggesLogger.error(`Erro ao buscar/criar livro do Google Books: ${error.message}`);
                throw error;
            }
        }
        
        if (!book) throw new NotFoundException('livro não encontrado')

        const exists = await this.prismaService.userBookshelfState.findUnique({
            where: {
                user_id_book_id: {
                    user_id,
                    book_id: numericBookId,
                },
            },
        });

        PaggesLogger.log(`Estado do livro na biblioteca: Já existe=${!!exists}`);

        if (exists) {
            const update = await this.prismaService.userBookshelfState.update({
                where: {
                    user_id_book_id: {
                        user_id,
                        book_id: numericBookId,
                    },
                },
                data: {
                    state: { set: listToAdd },
                },
            });
            return update;
        } else {
            const create = await this.prismaService.userBookshelfState.create({
                data: {
                    user_id,
                    book_id: numericBookId,
                    state: listToAdd,
                },
            });
            return create;
        }
    }

    async removeBookFromList(user_id: number, book_id: number) {
        const user = await this.prismaService.user.findFirst({
            where: {
                user_id: user_id,
            }
        })
        if (!user) throw new NotFoundException('usuário não encontrado')

        // Verifica se existe um estado do livro na biblioteca do usuário
        const bookInLibrary = await this.prismaService.userBookshelfState.findUnique({
            where: {
                user_id_book_id: {
                    user_id: user_id,
                    book_id: book_id,
                },
            }
        });
        
        if (!bookInLibrary) {
            throw new NotFoundException('Livro não encontrado na biblioteca do usuário');
        }

        const remove = await this.prismaService.userBookshelfState.delete({
            where: {
                user_id_book_id: {
                    user_id: user_id,
                    book_id: book_id,
                },
            }
        })

        PaggesLogger.log(`Livro removido da biblioteca do usuário: ${user_id}, livro ID: ${book_id}`);
        return remove;
    }

    async getBooksArray(user_id: number, state: BookshelfState) {
        const user = await this.prismaService.user.findFirst({
            where: {
                user_id: user_id,
            }
        });
    
        console.log("User found:", user);
        if (!user) throw new NotFoundException('usuário não encontrado');
    
        const arrayList = await this.prismaService.userBookshelfState.findMany({
            where: {
                user_id: user_id,
                state: state
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
                            }
                        }
                    }
                }
            }
        });
    
        return arrayList.map(entry => {
            const book = entry.book;
            
            if (book.isbn) {
                book.isbn = convertBigIntToString(book.isbn);
            }
    
            const userRating = book.ratings.length > 0 ? book.ratings[0].rating : null;

            return {
                ...entry,
                book, 
                userRating,
            };
        });
    }
    


    async getUserStatistics(user_id: number) {
        const user = await this.prismaService.user.findFirst({
            where: {
                user_id: user_id,
            }
        })
        if (!user) throw new NotFoundException('usuário não encontrado')

        const arrayList = await this.prismaService.userBookshelfState.findMany({
            where: {
                user_id: user_id,
                state: 'READ'
            },
            include: {
                book: true,
            }
        })

        const readBooks = arrayList.length;

        const readKms = arrayList.reduce((acc, item) => {
            return acc + (item.book?.pages ?? 0);
        }, 0);

        return {readBooks, readKms}
    }
}

function convertBigIntToString(obj: any): any {
    if (typeof obj === 'bigint') {
      return obj.toString();
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = convertBigIntToString(obj[key]);
      });
    }
    return obj;
  }
