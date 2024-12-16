import { CartsItem } from 'src/app/carts_item/entities/carts_item.entity';
import { Stock } from 'src/app/stock/entities/stock.entity';
import { TransactionItem } from 'src/app/transaction_items/entities/transaction_item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size_name: string;

  @OneToMany(() => Stock, (stock) => stock.size)
  stock: Stock[];

  @OneToMany(() => CartsItem, (cartItem) => cartItem.size)
  cartItem: CartsItem[];

  @OneToMany(() => TransactionItem, (transactionItem) => transactionItem.size)
  transactionItem: TransactionItem[];

  @CreateDateColumn()
  created_at: Date;
}
