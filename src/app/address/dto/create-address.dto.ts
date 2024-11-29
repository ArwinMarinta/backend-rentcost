import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  zip_code: string;

  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsNotEmpty()
  @IsString()
  address2: string;
}
