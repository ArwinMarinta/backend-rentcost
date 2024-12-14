import { ConfigModule } from '@nestjs/config';
import { Address } from 'src/app/address/entities/address.entity';
import { Auth } from 'src/app/auths/entities/auth.entity';
import { Banner } from 'src/app/banners/entities/banner.entity';
import { Cart } from 'src/app/carts/entities/cart.entity';
import { CartsItem } from 'src/app/carts_item/entities/carts_item.entity';
import { Category } from 'src/app/categories/entities/category.entity';
import { Payment } from 'src/app/payments/entities/payment.entity';
import { Product } from 'src/app/products/entities/product.entity';
import { Size } from 'src/app/sizes/entities/size.entity';
import { Stock } from 'src/app/stock/entities/stock.entity';
import { Store } from 'src/app/stores/entities/store.entity';
import { TransactionItem } from 'src/app/transaction_items/entities/transaction_item.entity';
import { Transaction } from 'src/app/transactions/entities/transaction.entity';
import { User } from 'src/app/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
ConfigModule.forRoot();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: 'junction.proxy.rlwy.net',
  port: 32864,
  seeds: ['dist/database/seeds/**/*.js'],
  username: 'postgres',
  password: 'UkNBHcgdlKlKdICsZeJyLSmpMdhpawgw',
  database: 'railway',
  entities: [
    User,
    Address,
    Auth,
    Banner,
    Cart,
    CartsItem,
    Category,
    Payment,
    Product,
    Size,
    Stock,
    Store,
    TransactionItem,
    Transaction,
  ],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: true,
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
