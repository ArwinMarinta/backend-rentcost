import { Address } from 'src/app/address/entities/address.entity';
import { Auth } from 'src/app/auths/entities/auth.entity';
import { Store } from 'src/app/stores/entities/store.entity';
import { Cart } from 'src/app/carts/entities/cart.entity';
import { Transaction } from 'src/app/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Auth)
  @JoinColumn()
  auth: Auth;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transaction: Transaction[];

  @OneToOne(() => Store, (store) => store.user)
  store: Store;

  @OneToMany(() => Address, (address) => address.user)
  address: Address[];

  @Column()
  username: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  identify_type: string;

  @Column({ nullable: true })
  identity_number: string;

  @Column({ nullable: true })
  bank_account: string;

  @Column({ nullable: true })
  image_url: string;

  @CreateDateColumn()
  created_at: Date;
}
