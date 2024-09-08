import { Category } from 'src/app/categories/entities/category.entity';
import { Size } from 'src/app/sizes/entities/size.entity';
import { Store } from 'src/app/stores/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Store, (store) => store.product)
  store: Store;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @ManyToMany(() => Size, (size) => size.product)
  @JoinTable()
  size: Size;

  @Column()
  product_name: string;

  @Column({ default: 0 })
  rate: number;

  @Column({ default: 0 })
  price: number;

  @Column()
  image_url: string;

  @Column({ default: 0 })
  rental_amount: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: false })
  available: boolean;

  @CreateDateColumn()
  created_at: Date;
}
