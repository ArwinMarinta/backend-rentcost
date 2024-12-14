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
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AuthGuard } from '../auths/auth.guard';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @UseGuards(AuthGuard)
  @Post(':id')
  async create(
    @Param('id') id: number,
    @Request() req: any,
    @Body() createCartDto: CreateCartDto,
  ) {
    try {
      await this.cartsService.create(id, req, createCartDto);

      return {
        message: 'Succefully add to cart',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findById(@Request() req: any) {
    try {
      const cart = await this.cartsService.findById(req);

      return {
        message: 'Successfully get cart',
        data: cart,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.cartsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }
}
