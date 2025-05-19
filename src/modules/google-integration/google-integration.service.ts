import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { PaggesLogger } from 'src/config/winston-logger/pagges-logger.utils'
import { FormattedBooksDtoResponse } from './dto/formattedBooksResponse.dto'
import { ImageLinks } from './types/types'
import {
  GoogleBooksVolumesSchema,
  GoogleBooksVolumesType,
} from './zod/book-schema-zod'
@Injectable()
export class GoogleIntegrationService {
  private readonly apiKey: string
  private readonly API_URL = 'https://www.googleapis.com/books/v1/volumes'

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow('GOOGLE_API_KEY')
  }

  async searchBooks(queryParam: string) {
    try {
      const query = `intitle:${queryParam}`
      const books = await this.callGoogleBooksApi(query)
      if (!books) {
        throw new InternalServerErrorException('Books data is undefined')
      }
      return await this.formatBooksForResponseDto(books)
    } catch (error) {
      PaggesLogger.error('Erro ao buscar livros:', error)
      throw error
    }
  }

  async searchByGenre(genres: string[]) {
    const genreResponseList: FormattedBooksDtoResponse[] =[]
    for (const genre of genres) {
      const query = `subject:${genres}`
      const data = await this.callGoogleBooksApi(query)
      if (!data) {
        throw new InternalServerErrorException('Books data is undefined')
      }
      
      const formatedBooks = await this.formatBooksForResponseDto(data)
      genreResponseList.push(...formatedBooks)
    }
    return genreResponseList.sort()
  }

  private async upscaleGoogleBooksCoverImage(
    googleBooksImageLink: string,
  ): Promise<string | null> {
    const imageCandidateUrl = googleBooksImageLink.replace(/zoom=\d/, 'zoom=10')

    const responseHeaders = await axios.head(imageCandidateUrl)

    if (
      responseHeaders.headers['content-length'] !== '9103' &&
      responseHeaders.headers['content-length'] !== '4448'
    ) {
      return imageCandidateUrl
    }
    return null
  }

  private async formatBooksForResponseDto(books: GoogleBooksVolumesType) {
    const formattedBooks: FormattedBooksDtoResponse[] = await Promise.all(
      books.map(async (book) => {
        const volumeInfo = book.volumeInfo

        if (
          !volumeInfo.title ||
          !volumeInfo.authors?.length ||
          !volumeInfo.pageCount ||
          !volumeInfo.description ||
          !volumeInfo.imageLinks ||
          !volumeInfo.publishedDate
        ) {
          return null
        }
        const bestBookCoverImage = this.getBestGoogleCoverBookImage(
          volumeInfo.imageLinks,
        )

        if (!bestBookCoverImage) {
          return null
        }

        const upscaledGoogleImageBook =
          await this.upscaleGoogleBooksCoverImage(bestBookCoverImage)

        if (!upscaledGoogleImageBook) {
          return null
        }

        return {
          id: book.id, // Adicionando o ID do livro na resposta
          titulo: volumeInfo.title,
          autores: volumeInfo.authors.filter(
            (author): author is string => !!author,
          ),
          capa: upscaledGoogleImageBook,
          paginas: volumeInfo.pageCount,
          sinopse: volumeInfo.description,
          anoDePublicacao: volumeInfo.publishedDate,
          generos: volumeInfo.categories
            ? volumeInfo.categories.filter(
                (category): category is string => !!category,
              )
            : undefined,
        }
      }),
    ).then((books) => books.filter((book) => book !== null)) // Filter undesired books
    return formattedBooks
  }

  private getBestGoogleCoverBookImage(imageLinks: ImageLinks): string | null {
    // Ordered by pixel width (≈1280 → 800 → 500 → 300 → 128)
    const priority = [
      imageLinks.extraLarge,
      imageLinks.large,
      imageLinks.medium,
      imageLinks.small,
      imageLinks.thumbnail,
      imageLinks.smallThumbnail,
    ]

    return priority.find(Boolean) ?? null
  }

  private async callGoogleBooksApi(queryParams: string) {
    try {
      const urlByTitle = `${this.API_URL}?q=${queryParams}&langRestrict=pt-BR&maxResults=30&printType=books&key=${this.apiKey}`

      const googleResponse = await axios.get(urlByTitle)

      const parsedResponse = GoogleBooksVolumesSchema.safeParse(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        googleResponse.data.items,
      )

      if (parsedResponse.error) {
        PaggesLogger.error(
          'Error parsing Google Books API response: ' +
            JSON.stringify(parsedResponse.error),
        )
        throw new InternalServerErrorException()
      }

      const uniqueBooks = this.getUniqueBooksById(parsedResponse.data)

      PaggesLogger.log('Successfully called Google Books API')
      return uniqueBooks
    } catch (error) {
      if (axios.isAxiosError(error)) {
        PaggesLogger.error(
          'An error occoured when calling Google API - Error:' + error.message,
        )
        throw new InternalServerErrorException()
      }
    }
  }

  private getUniqueBooksById(
    books: GoogleBooksVolumesType,
  ): GoogleBooksVolumesType {
    const booksIds = new Set<string>()
    const uniqueBooks: GoogleBooksVolumesType = []

    for (const book of books) {
      if (!booksIds.has(book.id)) {
        booksIds.add(book.id)
        uniqueBooks.push(book)
      }
    }

    return uniqueBooks
  }

  async getBookById(bookId: string) {
    try {
      PaggesLogger.log(`Buscando livro com ID ${bookId} na API do Google Books`)
      const url = `${this.API_URL}/${bookId}?key=${this.apiKey}`

      const response = await axios.get(url)

      if (!response.data || !response.data.volumeInfo) {
        PaggesLogger.error(`Dados do livro não encontrados para ID ${bookId}`)
        throw new InternalServerErrorException(
          'Livro não encontrado na API do Google',
        )
      }

      const volumeInfo = response.data.volumeInfo

      // Log para depuração
      PaggesLogger.log(`Livro encontrado: ${volumeInfo.title}`)

      // Obtém a melhor imagem de capa disponível
      const bestBookCoverImage = volumeInfo.imageLinks
        ? this.getBestGoogleCoverBookImage(volumeInfo.imageLinks)
        : null

      // Tenta melhorar a qualidade da imagem se disponível
      const upscaledGoogleImageBook = bestBookCoverImage
        ? await this.upscaleGoogleBooksCoverImage(bestBookCoverImage)
        : null

      return {
        googleBookId: bookId,
        title: volumeInfo.title || 'Sem título',
        authors: volumeInfo.authors?.join(', ') || 'Autor desconhecido',
        cover: bestBookCoverImage,
        google_image_url: upscaledGoogleImageBook || bestBookCoverImage,
        synopsis: volumeInfo.description || 'Sem sinopse disponível',
        year: volumeInfo.publishedDate
          ? volumeInfo.publishedDate.substring(0, 4)
          : null,
        pages: volumeInfo.pageCount || 0,
        genre: volumeInfo.categories?.join(', ') || 'Gênero desconhecido',
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        PaggesLogger.error(
          `Erro do Axios ao buscar livro com ID ${bookId}: ${error.message}`,
        )
        PaggesLogger.error(
          `Detalhes do erro: ${JSON.stringify(error.response?.data || {})}`,
        )
      } else {
        PaggesLogger.error(
          `Erro ao buscar livro com ID ${bookId}: ${error.message}`,
        )
      }
      throw new InternalServerErrorException(
        'Erro ao buscar livro na API do Google',
      )
    }
  }
}
