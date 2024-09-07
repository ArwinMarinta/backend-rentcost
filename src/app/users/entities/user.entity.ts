import { Auth } from 'src/app/auths/entities/auth.entity';
import { Store } from 'src/app/stores/entities/store.entity';
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
  @OneToMany(() => Store, (store) => store.user)
  store: Store[];
  @Column()
  username: string;
  @Column()
  phone_number: string;
  @Column()
  location: string;
  @Column()
  identify_type: string;
  @Column()
  identity_number: string;
  @Column()
  bank_account: string;
  @Column()
  image_url: string;
  @CreateDateColumn()
  created_at: Date;
}
