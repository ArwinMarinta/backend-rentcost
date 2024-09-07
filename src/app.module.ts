import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './app/categories/categories.module';
import { AuthsModule } from './app/auths/auths.module';
import { OtpModule } from './app/otp/otp.module';
import { UsersModule } from './app/users/users.module';
import { SizesModule } from './app/sizes/sizes.module';
import { StoresModule } from './app/stores/stores.module';
import { ProductsModule } from './app/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/datasource';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot(dataSourceOptions),
    CategoriesModule,
    AuthsModule,
    OtpModule,
    UsersModule,
    SizesModule,
    StoresModule,
    ProductsModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),

        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
