import {
  IsString,
  IsArray,
  MaxLength,
  ArrayMaxSize,
  IsOptional,
  IsInt,
  ArrayUnique,
} from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(250)
  biography?: string

  @IsOptional()
  @IsString()
  @MaxLength(250)
  genreIds?: string
}