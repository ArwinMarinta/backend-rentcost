import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ConfirmPasswordDto } from './dto/confirm-password';
import { ChangePasswordDto } from './dto/change-passoword';

@Injectable()
export class AuthsService {
  constructor(
    private dataSource: DataSource,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}
  async login(createLoginDto: CreateLoginDto): Promise<object> {
    const auth = await this.findOne(createLoginDto.email);

    if (!auth) {
      throw new NotFoundException('Email tidak terdaftar');
    }
    const isMatch = await bcrypt.compare(
      createLoginDto.password,
      auth.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }
    const payload = { auth_id: auth.id };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token,
    };
  }
  async findOne(email: string): Promise<Auth | null> {
    const auth = await this.dataSource.getRepository(Auth).findOne({
      where: {
        email,
      },
    });

    if (!auth) {
      return null;
    }
    return auth;
  }

  async register(createAuthDto: CreateAuthDto): Promise<void> {
    const newUser = await this.dataSource
      .getRepository(Auth)
      .findOne({ where: { email: createAuthDto.email } });

    if (newUser) {
      throw new ConflictException('Email already exists');
    }

    await this.dataSource.transaction(async (manager) => {
      try {
        const newAuth = await manager
          .createQueryBuilder()
          .insert()
          .into(Auth)
          .values({
            email: createAuthDto.email,
            password: await bcrypt.hash(createAuthDto.password, 10),
            is_verified: false,
          })
          .execute();

        const newAuthId = newAuth.identifiers[0].id;

        await manager
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            username: createAuthDto.username,
            phone_number: createAuthDto.phone_number,
            // location: createAuthDto.location,
            // identify_type: createAuthDto.identity_type,
            // identity_number: createAuthDto.identity_number,
            // bank_account: createAuthDto.bank_account,
            image_url:
              'https://ik.imagekit.io/xoh0kfeiy/photo-1534528741775-53994a69daeb.webp?updatedAt=1734006901379',
            auth: newAuthId,
          })
          .execute();
      } catch (error) {
        console.error('Error during transaction:', error);
        throw error; // Re-throw to rollback transaction
      }
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordRequestDto) {
    const user = await this.dataSource.getRepository(Auth).findOne({
      where: {
        email: resetPasswordDto.email,
      },

      select: ['id', 'email', 'user'],
    });
    if (!user) {
      throw new NotFoundException('Email tidak ditemukan');
    }
    const resetToken = await this.jwtService.signAsync(
      {
        email: user.email,
      },
      {
        secret: process.env.MAIL_SECRET,
        expiresIn: '5m',
      },
    );

    return resetToken;

    //     const link = `${process.env.RESET_PASSWORD_LINK || 'http://localhost:3000'}?token=${resetToken}`;
    //     const html = `<b> Hi ${user.user.username}, </b>
    // <p> You requested to reset your password. </p>
    // <p> Please, click the link below to reset your password. </p>
    // <a href = "${link}"> Reset Password </a>  `;
    //     await this.mailerService.sendMail({
    //       from: process.env.MAIL_USER,
    //       to: user.email,
    //       subject: 'Reset Password Request',
    //       html,
    //     });
  }

  async confirmResetPassword(
    confirmPasswordDto: ConfirmPasswordDto,
  ): Promise<void> {
    const payload = await this.jwtService.verifyAsync(
      confirmPasswordDto.token,
      {
        secret: process.env.MAIL_SECRET,
      },
    );

    console.log(payload.email);
    if (!payload) {
      throw new UnauthorizedException('Invalid Token');
    }
    if (confirmPasswordDto.password !== confirmPasswordDto.confirm_password) {
      throw new BadRequestException('Password Not Match');
    }
    await this.dataSource
      .createQueryBuilder()
      .update(Auth)
      .set({
        password: await bcrypt.hash(confirmPasswordDto.password, 10),
      })
      .where('email = :email', { email: payload.user })
      .execute();
  }

  async changePassword(
    changePassword: ChangePasswordDto,
    req: any,
  ): Promise<void> {
    const auth = await this.dataSource
      .getRepository(Auth)
      .findOne({ where: { id: req.user.auth_id } });

    if (!auth) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(
      changePassword.oldPassword,
      auth.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Password lama salah');
    }

    await this.dataSource
      .createQueryBuilder()
      .update(Auth)
      .set({ password: await bcrypt.hash(changePassword.NewPassword, 10) })
      .where('id = :id', { id: auth.id })
      .execute();
  }
}
