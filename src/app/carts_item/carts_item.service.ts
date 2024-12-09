import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartsItemDto } from './dto/create-carts_item.dto';
import { UpdateCartsItemDto } from './dto/update-carts_item.dto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CartsItem } from './entities/carts_item.entity';

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
      relations: ['cart', 'product', 'size'], // Menyertakan relasi yang ingin Anda muat
      select: ['id', 'quantity', 'cart', 'product', 'size'],
    });

    return cartItem;
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
