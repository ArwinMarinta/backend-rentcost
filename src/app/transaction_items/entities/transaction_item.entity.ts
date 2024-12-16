import { Product } from 'src/app/products/entities/product.entity';
import { Size } from 'src/app/sizes/entities/size.entity';
import { Transaction } from 'src/app/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusTransaction {
  DIPROSES = 'diproses',
  DIKIRIM = 'dikirim',
  RENTAL = 'rental',
  DIBATALKAN = 'dibatalkan',
  SELESAI = 'selesai',
}

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusTransaction,
    default: StatusTransaction.DIPROSES,
  })
  status: StatusTransaction;

  @ManyToOne(() => Product, (product) => product.transactionItem)
  product: Product;

  @ManyToOne(() => Transaction, (item) => item.transactionItem)
  transaction = Transaction;

  @ManyToOne(() => Size, (size) => size.transactionItem)
  size: Size;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: false })
  rating: boolean;

  @CreateDateColumn()
  created_at: Date;
}
