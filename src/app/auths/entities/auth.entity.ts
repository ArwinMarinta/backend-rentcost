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
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: true })
  is_verified: boolean;
  @CreateDateColumn()
  created_at: Date;
}
