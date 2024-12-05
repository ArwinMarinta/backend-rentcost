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
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { AuthGuard } from '../auths/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from 'src/utils/imagekit.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileService: ImageKitService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image_url'))
  async create(
    @Request() req: any,
    @UploadedFile() image_url: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const uploadResult = await this.fileService.uploadImage(image_url);

    // Remove surrounding quotes and parse JSON
    let sizeStockArray: Array<{ size_id: number; stok: number }> = [];

    if (typeof createProductDto.size_stock === 'string') {
      try {
        sizeStockArray = JSON.parse(
          createProductDto.size_stock.replace(/^"|"$/g, ''),
        );
      } catch (error) {
        throw new BadRequestException('Invalid size_stock format');
      }
    }

    await this.productsService.create(
      createProductDto,
      req,
      uploadResult.url,
      sizeStockArray,
    );

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

  @Get('search')
  async findByQuery(
    @Query('filter') filter: string,
    @Query('search') search: string,
  ) {
    try {
      const products = await this.productsService.findByQuery(filter, search);

      return {
        message: 'Get all products successfully',
        data: products,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const detail = await this.productsService.findOne(id);

      return {
        message: 'Get all products successfully',
        data: detail,
      };
    } catch (error) {
      createHttpException(error);
    }
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
