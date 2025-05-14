import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsNotEmpty, Max, Min } from "class-validator"

export class BookRatingDto {
    @ApiProperty({
        description: "O ID do livro",
        example: 123,
      })
    @IsNotEmpty({ message: 'O id do livro não pode ser vazio.' })
    book_id: number
    
    @ApiProperty({
      description: "A nota do livro",
      example: 4,
      })
    @IsInt({ message: 'A nota deve ser um número inteiro.' })
    @Min(1, { message: 'A nota mínima é 1.' })
    @Max(5, { message: 'A nota máxima é 5.' })
    @IsNotEmpty({ message: 'A nota não pode ser vazia.' })
    rating: number
}
