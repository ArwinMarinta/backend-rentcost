import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsNumber()
  size_id: number;

  @IsNotEmpty()
  @IsNumber()
  stok: number;
}
