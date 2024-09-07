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
      throw new NotFoundException('User Not Found');
    }
    const isMatch = await bcrypt.compare(
      createLoginDto.password,
      auth.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Wrong Password');
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

    const newAuth = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Auth)
      .values({
        email: createAuthDto.email,
        password: await bcrypt.hash(createAuthDto.password, 10),
        is_verified: false,
      })
      .execute();

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username: createAuthDto.username,
        phone_number: createAuthDto.phone_number,
        location: createAuthDto.location,
        identify_type: createAuthDto.identity_type,
        identity_number: createAuthDto.identity_number,
        bank_account: createAuthDto.bank_account,
        image_url: createAuthDto.image_url,
        auth: newAuth.identifiers[0].id,
      })
      .execute();
  }

  async resetPassword(resetPasswordDto: ResetPasswordRequestDto) {
    const user = await this.dataSource.getRepository(Auth).findOne({
      where: {
        email: resetPasswordDto.email,
      },

      select: ['id', 'email', 'user'],
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const resetToken = await this.jwtService.signAsync(
      {
        user: user.id,
      },
      {
        secret: process.env.MAIL_SECRET,
        expiresIn: '5m',
      },
    );
    const link = `${process.env.RESET_PASSWORD_LINK || 'http://localhost:3000'}?token=${resetToken}`;
    const html = `<b> Hi ${user.user.username}, </b>
<p> You requested to reset your password. </p>
<p> Please, click the link below to reset your password. </p>
<a href = "${link}"> Reset Password </a>  `;
    await this.mailerService.sendMail({
      from: process.env.MAIL_USER,
      to: user.email,
      subject: 'Reset Password Request',
      html,
    });
  }

  async confirmResetPassword(confirmPasswordDto: ConfirmPasswordDto) {
    const payload = await this.jwtService.verifyAsync(
      confirmPasswordDto.token,
      {
        secret: process.env.MAIL_SECRET,
      },
    );
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
      .where('id = :id', { id: payload.user })
      .execute();
  }
}
