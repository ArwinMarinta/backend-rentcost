import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from 'src/app/carts/entities/cart.entity';
import { Product } from 'src/app/products/entities/product.entity';

@Entity()
export class CartsItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItem)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItem)
  product: Product;

  @Column()
  quantity: number;
}
