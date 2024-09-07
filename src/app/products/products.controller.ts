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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { AuthGuard } from '../auths/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() req: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    await this.productsService.create(createProductDto, req);

    return {
      message: 'Product created successfully',
    };
  }

  @Get()
  async findAll() {
    try {
      const products = await this.productsService.findAll();

      return {
        message: 'Get all products successfully',
        data: products,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      await this.productsService.update(+id, updateProductDto);
      return {
        message: 'Update product successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.productsService.remove(+id);

      return {
        message: 'Category successfully removed',
      };
    } catch (error) {
      createHttpException(error);
    }
  }
}
