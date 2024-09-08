import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SizesService } from './sizes.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { AuthGuard } from '../auths/auth.guard';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';

@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createSizeDto: CreateSizeDto) {
    try {
      await this.sizesService.create(createSizeDto);

      return {
        message: 'Size created successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      const size = await this.sizesService.findAll();

      return {
        message: 'Get all size successfully',
        data: size,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    try {
      await this.sizesService.update(+id, updateSizeDto);

      return {
        message: 'Update size successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizesService.remove(+id);
  }
}
