import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartsItemDto } from './dto/create-carts_item.dto';
import { UpdateCartsItemDto } from './dto/update-carts_item.dto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CartsItem } from './entities/carts_item.entity';
import { Cart } from '../carts/entities/cart.entity';

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

  update(id: number, updateCartsItemDto: UpdateCartsItemDto) {
    return `This action updates a #${id} cartsItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartsItem`;
  }
}
