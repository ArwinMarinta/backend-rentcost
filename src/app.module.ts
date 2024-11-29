import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './app/categories/categories.module';
import { AuthsModule } from './app/auths/auths.module';
import { UsersModule } from './app/users/users.module';
import { SizesModule } from './app/sizes/sizes.module';
import { StoresModule } from './app/stores/stores.module';
import { ProductsModule } from './app/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/datasource';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { BannersModule } from './app/banners/banners.module';
import { CartsModule } from './app/carts/carts.module';
import { CartsItemModule } from './app/carts_item/carts_item.module';
import { TransactionsModule } from './app/transactions/transactions.module';
import { TransactionItemsModule } from './app/transaction_items/transaction_items.module';
import { AddressModule } from './app/address/address.module';
import { PaymentsModule } from './app/payments/payments.module';
import { StockModule } from './app/stock/stock.module';
import { ImageKitModule } from './utils/imagekit.module';
@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot(dataSourceOptions),
    CategoriesModule,
    AuthsModule,
    UsersModule,
    SizesModule,
    StoresModule,
    ProductsModule,
    BannersModule,
    CartsModule,
    CartsItemModule,
    TransactionsModule,
    TransactionItemsModule,
    AddressModule,
    PaymentsModule,
    ImageKitModule,
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
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
