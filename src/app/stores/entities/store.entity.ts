import { Product } from 'src/app/products/entities/product.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.store)
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
