// get_user_infos.dto.ts
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetUserInfosDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  username?: string;
}
