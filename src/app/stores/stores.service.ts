import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { DataSource } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class StoresService {
  constructor(private dataSource: DataSource) {}

  async create(createStoreDto: CreateStoreDto, req: any): Promise<void> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const store = await this.dataSource
      .getRepository(Store)
      .findOne({ where: { store_name: createStoreDto.store_name } });

    if (store) {
      throw new ConflictException('Store name already exist');
    }
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Store)
      .values({ ...createStoreDto, user: user })
      .execute();
  }

  async findProductUser(req: any): Promise<any[]> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const store = await this.dataSource.getRepository(Store).findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (!store) {
      throw new NotFoundException('store not found or not authenticated');
    }

    const product = await this.dataSource
      .getRepository(Product)
      .find({ where: { store: { id: store.id } } });

    return product;
  }

  async findAll(): Promise<CreateStoreDto[]> {
    const stores = await this.dataSource.getRepository(Store).find();
    return stores;
  }

  async findOne(id: number) {
    const store = await this.dataSource.getRepository(Store).findOne({
      where: { id },
    });
    return store;
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.findOne(id);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    await this.dataSource
      .createQueryBuilder()
      .update(Store)
      .set(updateStoreDto)
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number): Promise<void> {
    const store = await this.dataSource.getRepository(Store).findOne({
      where: {
        id: id,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    await this.dataSource.getRepository(Store).delete(store.id);
  }
}
