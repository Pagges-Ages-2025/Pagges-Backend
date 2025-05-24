import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { GoogleIntegrationService } from './google-integration.service'
@Controller('google-integration')
export class GoogleIntegrationController {
  constructor(
    private readonly googleIntegrationService: GoogleIntegrationService,
  ) {}

  @ApiOperation({ summary: 'Buscar livros por título' })
  @ApiResponse({ status: 200, description: 'Busca realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao realizar busca' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  @ApiResponse({ status: 404, description: 'Nenhum livro encontrado' })
  @Get('search/:term')
  searchByTerm(@Param('term') term: string) {
    return this.googleIntegrationService.searchBooks(term)
  }

  @ApiOperation({ summary: 'Buscar livros por genêro' })
  @ApiResponse({ status: 200, description: 'Busca realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao realizar busca' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  @ApiResponse({ status: 404, description: 'Nenhum livro encontrado' })
  @Post('genres')
  searchByGenres(@Body() genres: string[]) {
    return this.googleIntegrationService.searchByGenre(genres)
  }
}
