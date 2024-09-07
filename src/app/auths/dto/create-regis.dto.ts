import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateRegisDto {
  @IsNotEmpty()
  @IsString()
  namaLengkap: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  noTelp: string;
}
