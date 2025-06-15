import { IsNotEmpty, IsString } from "class-validator";

export class UserUnfollowDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
