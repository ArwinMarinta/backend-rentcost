import { Injectable } from '@nestjs/common';
import { CreateCartsItemDto } from './dto/create-carts_item.dto';
import { UpdateCartsItemDto } from './dto/update-carts_item.dto';

@Injectable()
export class CartsItemService {
  create(createCartsItemDto: CreateCartsItemDto) {
    return 'This action adds a new cartsItem';
  }

  findAll() {
    return `This action returns all cartsItem`;
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
