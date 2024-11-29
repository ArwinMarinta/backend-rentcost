import { Product } from 'src/app/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Product, (product) => product.category)
  product: Product;
  @Column()
  category_name: string;
  @Column()
  image_url: string;
  @CreateDateColumn()
  created_at: Date;
}
