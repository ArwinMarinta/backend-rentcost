import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { AuthGuard } from '../auths/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from 'src/utils/imagekit.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly fileService: ImageKitService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image_url'))
  async create(
    @UploadedFile() image_url: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const uploadResult = await this.fileService.uploadImage(image_url);

    await this.categoriesService.create(createCategoryDto, uploadResult.url);

    return {
      message: 'Category created successfully',
    };
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      message: 'Categories fetched successfully',
      data: categories,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      await this.categoriesService.update(+id, updateCategoryDto);
      return {
        message: 'Category updated successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.categoriesService.remove(+id);
      return {
        message: 'Category successfully removed',
      };
    } catch (error) {
      createHttpException(error);
    }
  }
}
