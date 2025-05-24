import { IsNumber } from "class-validator";

export class UpdateUserPointsDto {
  @IsNumber()
  alternative_id: number;
}
