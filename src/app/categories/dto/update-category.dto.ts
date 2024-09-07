import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  category_name: string;
}
