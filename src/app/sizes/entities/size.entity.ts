import { Product } from 'src/app/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.size)
  product: Product;

  @Column()
  size_name: string;

  @CreateDateColumn()
  created_at: Date;
}
