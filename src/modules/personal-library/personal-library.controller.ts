import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common'
import { UserTokenInfo } from 'src/decorators/user-info.decorator';
import { JwtPayload } from 'src/interfaces/user-info.interface';
import { PersonalLibraryService } from './personal-library.service';

export enum BookshelfState {
  TO_BE_READ = 'TO_BE_READ',
  READING = 'READING',
  READ = 'READ',
}

@Controller('personal-library')
export class PersonalLibraryController {
  constructor(
    private readonly personalLibrary: PersonalLibraryService
  ) {}

  @Put('addBook/:bookId')
  addBookToList(
    @UserTokenInfo() userInfo: JwtPayload, 
    @Param('bookId') bookId: string, 
    @Body() listToAdd: { state: BookshelfState }
  ) {
    return this.personalLibrary.addBookToList(userInfo.id, bookId, listToAdd.state)
  }

  @Delete('removeBook/:bookId')
  removeBookFromList(
    @UserTokenInfo() userInfo: JwtPayload, 
    @Param('bookId') bookId: string
  ) {
    // Converte para número se for um ID numérico, caso contrário usa a mesma função hash do service
    const numericBookId = !isNaN(Number(bookId)) ? 
      Number(bookId) : 
      this.hashStringToNumber(bookId);
      
    return this.personalLibrary.removeBookFromList(userInfo.id, numericBookId)
  }

  @Get('getBooksArray/:listName')
  getBooksArray(@UserTokenInfo() userInfo: JwtPayload, @Param('listName') listName: BookshelfState) {
    const state: BookshelfState = listName as BookshelfState;
    return this.personalLibrary.getBooksArray(userInfo.id, state)
  }

  @Get('getUserStatistics')
  getUserStatistics(@UserTokenInfo() userInfo: JwtPayload) {
    return this.personalLibrary.getUserStatistics(userInfo.id)
  }
  
  // Função duplicada do service para garantir consistência na conversão
  private hashStringToNumber(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return Math.abs(hash % 1000000) + 10000;
  }
}
