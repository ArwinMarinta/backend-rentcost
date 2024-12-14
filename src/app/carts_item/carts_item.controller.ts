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

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Request() req: any) {
    try {
      await this.cartsItemService.update(id, req);

      return {
        message: 'Berhasil mengubah',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req: any) {
    try {
      await this.cartsItemService.remove(id, req);

      return {
        message: 'Berhasil menghapus',
      };
    } catch (error) {
      createHttpException(error);
    }
  }
}
