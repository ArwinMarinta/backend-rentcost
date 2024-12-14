import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/app/users/entities/user.entity';
import { TransactionItem } from 'src/app/transaction_items/entities/transaction_item.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transaction)
  user: User;

  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.transaction,
  )
  transactionItem: TransactionItem[];

  @Column()
  total_price: string;

  @Column()
  payment_image: string;
}
