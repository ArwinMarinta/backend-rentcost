import { Product } from 'src/app/products/entities/product.entity';
import { Size } from 'src/app/sizes/entities/size.entity';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stok: number;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => Size, (size) => size.stock)
  size: Size;

  @ManyToOne(() => Product, (product) => product.stock)
  product: Product;
}
