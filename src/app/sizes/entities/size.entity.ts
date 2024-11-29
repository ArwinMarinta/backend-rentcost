import { Stock } from 'src/app/stock/entities/stock.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size_name: string;

  @ManyToMany(() => Stock, (stock) => stock.size)
  stock: Stock;

  @CreateDateColumn()
  created_at: Date;
}
