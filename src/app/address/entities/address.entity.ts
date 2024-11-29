import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.address)
  user: User;

  @Column()
  username: string;

  @Column()
  phone_number: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip_code: string;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @CreateDateColumn()
  created_at: Date;
}
