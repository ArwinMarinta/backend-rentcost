import { CartsItem } from 'src/app/carts_item/entities/carts_item.entity';
import { Category } from 'src/app/categories/entities/category.entity';
import { Size } from 'src/app/sizes/entities/size.entity';
import { Store } from 'src/app/stores/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Store, (store) => store.product)
  store: Store;

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @OneToMany(() => Size, (size) => size.product)
  size: Size[];

  @OneToMany(() => CartsItem, (cartItem) => cartItem.product)
  cartItem: CartsItem[];

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
