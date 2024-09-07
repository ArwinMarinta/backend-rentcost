import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  otp: string;
  @Column()
  expired_at: Date;
  @CreateDateColumn()
  created_at: Date;
}
