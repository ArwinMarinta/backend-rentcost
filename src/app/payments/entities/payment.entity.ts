import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum StatusPayment {
  PICKED = 'picked',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: StatusPayment, default: StatusPayment.PICKED })
  status: StatusPayment;

  @Column()
  provider: string;
}
