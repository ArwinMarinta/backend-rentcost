import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { AuthGuard } from '../auths/auth.guard';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req: any, @Body() createStoreDto: CreateStoreDto) {
    try {
      await this.storesService.create(createStoreDto, req);

      return {
        message: 'Store created successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async findProductUser(@Request() req: any) {
    try {
      const product = await this.storesService.findProductUser(req);

      return {
        message: 'Get all product successfully',
        data: product,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    try {
      const stores = await this.storesService.findAll();

      return {
        message: 'Get all stores successfully',
        data: stores,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    try {
      await this.storesService.update(+id, updateStoreDto);
      return {
        message: 'Update store successfully',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.storesService.remove(id);

      return {
        message: 'Store successfully removed',
      };
    } catch (error) {
      createHttpException(error);
    }
  }
}
