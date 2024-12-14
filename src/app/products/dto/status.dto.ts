import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StatusDtoRating {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  transaction_id: number;

  @IsNotEmpty()
  @IsString()
  status: string;
}
