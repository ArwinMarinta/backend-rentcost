import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDtoRating {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  total_rating: number;

  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  transactiId: number;
}
