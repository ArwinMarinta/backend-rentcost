import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from '../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Address } from './entities/address.entity';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { Cart } from '../carts/entities/cart.entity';

@Injectable()
export class AddressService {
  constructor(private dataSource: DataSource) {}

  async create(createAddressDto: CreateAddressDto, req: any): Promise<void> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Address)
      .values({ ...createAddressDto, user: user })
      .execute();
  }

  async findById(req: any) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const addressUser = await this.dataSource.getRepository(Address).find({
      where: { user: { id: user.id } },
      order: {
        used: 'DESC',
      },
    });

    return addressUser;
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  async update(id: number, req: any) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const existingAddress = await this.dataSource
      .getRepository(Address)
      .findOne({ where: { id: id } });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    const existingCart = await this.dataSource
      .getRepository(Cart)
      .findOne({ where: { user: { id: user.id } } });

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      try {
        // Jika cart tidak ada, buat cart baru
        let cart = existingCart;
        if (!cart) {
          cart = this.dataSource.getRepository(Cart).create({
            user: { id: user.id },
            address: { id: id }, // Atur nilai default untuk properti cart jika diperlukan
          });
          await transactionalEntityManager.save(Cart, cart);
        }

        // Update address yang digunakan
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Address)
          .set({ used: true })
          .where('id = :id', { id })
          .execute();

        await transactionalEntityManager
          .createQueryBuilder()
          .update(Address)
          .set({ used: false })
          .where('id != :id', { id })
          .execute();

        // Update address pada cart
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Cart)
          .set({ address: existingAddress.id })
          .where('userId = :userId', { userId: user.id })
          .execute();
      } catch (error) {
        throw createHttpException(error);
      }
    });
  }

  async remove(id: number) {
    const address = await this.dataSource
      .getRepository(Address)
      .findOne({ where: { id: id } });

    if (!address) {
      throw new NotFoundException('Address not founds');
    }

    await this.dataSource.getRepository(Address).delete(address.id);
  }
}
