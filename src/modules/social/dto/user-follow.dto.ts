import { IsNotEmpty, IsString } from "class-validator";

export class UserFollowDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
