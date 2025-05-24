import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class BookToRegisterDto {
  @IsString()
  @IsNotEmpty()
  google_book_id: string;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  autores: string[];

  @IsNumber()
  @IsNotEmpty()
  paginas: number;

  @IsString()
  @IsOptional()
  sinopse?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  generos?: string[];

  @IsString()
  @IsNotEmpty()
  anoDePublicacao: string;

  @IsString()
  @IsNotEmpty()
  google_image_url: string;
}
