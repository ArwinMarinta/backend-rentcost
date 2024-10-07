import { Product } from 'src/app/products/entities/product.entity';
import { User } from 'src/app/users/entities/user.entity';
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
export class Store {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @OneToMany(() => Product, (product) => product.store)
  product: Product;
  @Column({ unique: true })
  store_name: string;
  @Column()
  store_location: string;
  @CreateDateColumn()
  created_at: Date;
}
