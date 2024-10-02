import { CartsItem } from 'src/app/carts_item/entities/carts_item.entity';
import { User } from 'src/app/users/entities/user.entity';
import { OneToMany, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartsItem, (cartItem) => cartItem.cart)
  cartItem: CartsItem;
}
