import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

import { User } from 'src/app/users/entities/user.entity';
@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.auth)
  user: User;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  is_verified: boolean;
  @CreateDateColumn()
  created_at: Date;
}
