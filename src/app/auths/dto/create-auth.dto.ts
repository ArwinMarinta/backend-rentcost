import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  //   @IsNotEmpty()
  //   @IsBoolean()
  //   is_verified: boolean;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  // @IsNotEmpty()
  // @IsString()
  // location: string;

  // // @IsNotEmpty()
  // @IsString()
  // identity_type: string;

  // // @IsNotEmpty()
  // @IsString()
  // identity_number: string;

  // // @IsNotEmpty()
  // @IsString()
  // bank_account: string;

  // // @IsNotEmpty()
  // @IsString()
  // image_url: string;
}
