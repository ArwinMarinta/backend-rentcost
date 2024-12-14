import { CartsItem } from 'src/app/carts_item/entities/carts_item.entity';
import { Category } from 'src/app/categories/entities/category.entity';
import { Stock } from 'src/app/stock/entities/stock.entity';
import { Store } from 'src/app/stores/entities/store.entity';
import { TransactionItem } from 'src/app/transaction_items/entities/transaction_item.entity';
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

  @OneToMany(() => CartsItem, (cartItem) => cartItem.product)
  cartItem: CartsItem[];

  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.product,
  )
  transactionItem: TransactionItem[];

  @OneToMany(() => Stock, (stock) => stock.product)
  stock: Stock[];

  @Column()
  product_name: string;

  @Column({ type: 'decimal', precision: 10, scale: 1, default: 0 })
  rate: number;

  @Column({ default: 0 })
  price: number;

  @Column()
  image_url: string;

  @Column({ default: 0 })
  rental_amount: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: false })
  available: boolean;

  @Column({ default: 0 })
  total_rating: number; // Menyimpan jumlah total rating

  @Column({ default: 0 })
  rating_count: number; // Menyimpan jumlah rating yang diterima

  @CreateDateColumn()
  created_at: Date;
}
