import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartsItemService } from './carts_item.service';
import { CreateCartsItemDto } from './dto/create-carts_item.dto';
import { UpdateCartsItemDto } from './dto/update-carts_item.dto';
import { AuthGuard } from '../auths/auth.guard';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';

@Controller('carts-item')
export class CartsItemController {
  constructor(private readonly cartsItemService: CartsItemService) {}

  @Post()
  create(@Body() createCartsItemDto: CreateCartsItemDto) {
    return this.cartsItemService.create(createCartsItemDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req: any) {
    try {
      const cartItem = await this.cartsItemService.findAll(req);

      return {
        message: 'Berhasil get cart',
        data: cartItem,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartsItemDto: UpdateCartsItemDto,
  ) {
    return this.cartsItemService.update(+id, updateCartsItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsItemService.remove(+id);
  }
}
