import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { Auth } from '../auths/entities/auth.entity';
import { Store } from '../stores/entities/store.entity';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(req: any) {
    const user = await this.dataSource.getRepository(Auth).findOne({
      where: { id: req.user.auth_id },
      relations: ['user'],
    });

    const store = await this.dataSource.getRepository(Store).findOne({
      where: {
        user: { id: user?.user.id },
      },
    });

    const data = {
      auth: user,
      store,
    };

    return data;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
