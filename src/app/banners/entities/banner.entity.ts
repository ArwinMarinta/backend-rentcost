import { PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  banner_name: string;

  @Column()
  image_url: string;

  @CreateDateColumn()
  created_at: Date;
}
