import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {

  @ApiProperty({
    description: 'O email do usuário',
    example: 'user.email@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'A senha do usuário',
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
