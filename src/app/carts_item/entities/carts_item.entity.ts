import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from 'src/app/carts/entities/cart.entity';
import { Product } from 'src/app/products/entities/product.entity';
import { Size } from 'src/app/sizes/entities/size.entity';

@Entity()
export class CartsItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItem)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItem)
  product: Product;

  @ManyToOne(() => Size, (size) => size.cartItem)
  size: Size;

  @Column()
  quantity: number;
}
