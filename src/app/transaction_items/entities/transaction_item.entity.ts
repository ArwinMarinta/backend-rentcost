import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusTransaction {
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StatusTransaction,
    default: StatusTransaction.SHIPPED,
  })
  status: StatusTransaction;

  @Column()
  quantity: number;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column()
  penalty_fee: string;

  @CreateDateColumn()
  created_at: Date;
}
