import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartsItemService } from './carts_item.service';
import { CreateCartsItemDto } from './dto/create-carts_item.dto';
import { UpdateCartsItemDto } from './dto/update-carts_item.dto';

@Controller('carts-item')
export class CartsItemController {
  constructor(private readonly cartsItemService: CartsItemService) {}

  @Post()
  create(@Body() createCartsItemDto: CreateCartsItemDto) {
    return this.cartsItemService.create(createCartsItemDto);
  }

  @Get()
  findAll() {
    return this.cartsItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartsItemDto: UpdateCartsItemDto) {
    return this.cartsItemService.update(+id, updateCartsItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsItemService.remove(+id);
  }
}
