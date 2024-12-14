import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartsItemDto } from './dto/create-carts_item.dto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CartsItem } from './entities/carts_item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { Address } from '../address/entities/address.entity';

@Injectable()
export class CartsItemService {
  constructor(private dataSource: DataSource) {}

  create(createCartsItemDto: CreateCartsItemDto) {
    return 'This action adds a new cartsItem';
  }

  async findAll(req: any): Promise<any> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const cartItem = await this.dataSource.getRepository(CartsItem).find({
      where: {
        cart: {
          user: {
            id: user.id,
          },
        },
      },
      relations: [
        'cart',
        'product',
        'size',
        'product.category',
        'product.stock',
      ],
      select: {
        id: true,
        quantity: true,
        product: {
          id: true,
          image_url: true,
          product_name: true,
          price: true,
          rate: true,
          rental_amount: true,
          stock: {
            id: true,
            stok: true,
            available: true,
          },
          category: {
            id: true,
            category_name: true,
          },
        },
        size: {
          id: true,
          size_name: true,
        },
      },
    });

    const address = await this.dataSource.getRepository(Cart).findOne({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: ['address'],
      select: {
        address: {
          id: true,
          username: true,
          city: true,
          address1: true,
          address2: true,
          created_at: true,
          phone_number: true,
          state: true,
          used: true,
          zip_code: true,
        },
      },
    });

    return {
      address,
      cartItem,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} cartsItem`;
  }

  async update(id: number, req: any): Promise<void> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }
    const address = await this.dataSource
      .getRepository(Address)
      .findOne({ where: { id } });

    if (!address) {
      throw new Error('Address not found');
    }
    await this.dataSource.transaction(async (cart) => {
      await cart
        .createQueryBuilder()
        .update(Address)
        .set({ used: false })
        .where('userId = :userId', { userId: user.id })
        .execute();

      await cart
        .createQueryBuilder()
        .update(Address)
        .set({ used: true })
        .where('id = :id', { id })
        .execute();

      await cart
        .createQueryBuilder()
        .update(Cart)
        .set({ address: { id: id } })
        .where('userId = :userId', { userId: user.id })
        .execute();
    });
  }

  async remove(id: number, req: any) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const cart = await this.dataSource
      .getRepository(Cart)
      .findOne({ where: { user: { id: user.id } } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Cari item di dalam cart
    const item = await this.dataSource.getRepository(CartsItem).findOne({
      where: {
        id: id,
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Hapus item dari cart
    await this.dataSource.getRepository(CartsItem).delete({ id: item.id });
  }
}
