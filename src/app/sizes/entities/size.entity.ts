import { Stock } from 'src/app/stock/entities/stock.entity';
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

  @CreateDateColumn()
  created_at: Date;
}
