import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ConfirmPasswordDto } from './dto/confirm-password';
// import { CreateRegisDto } from './dto/create-regis.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
import { ChangePasswordDto } from './dto/change-passoword';

@Controller('auth')
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('/login')
  async login(@Body(new ValidationPipe()) createLoginDto: CreateLoginDto) {
    try {
      const loginService = await this.authsService.login(createLoginDto);
      return {
        message: 'Login successfully',
        data: loginService,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Post('/register')
  async register(@Body(new ValidationPipe()) createAuthDto: CreateAuthDto) {
    try {
      const registerService = await this.authsService.register(createAuthDto);
      return {
        message: 'Register successfully',
        data: registerService,
      };
    } catch (error) {
      createHttpException(error);
    }
  }
  @Post('/reset-password')
  async resetPassword(
    @Body(new ValidationPipe()) resetPasswordDto: ResetPasswordRequestDto,
  ) {
    try {
      await this.authsService.resetPassword(resetPasswordDto);
      return {
        message: 'Reset password successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Post('/confirm-password')
  async confirmPassword(
    @Body(new ValidationPipe()) confirmPasswordDto: ConfirmPasswordDto,
  ) {
    try {
      await this.authsService.confirmResetPassword(confirmPasswordDto);
      return {
        message: 'Confirm password successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async ChangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any,
  ) {
    try {
      await this.authsService.changePassword(changePasswordDto, req);
      return {
        message: 'Berhasil Mengubah password',
      };
    } catch (error) {
      createHttpException(error);
    }
  }
}
