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
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { AuthGuard } from '../auths/auth.guard';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @UseGuards(AuthGuard)
  @Post(':id')
  async create(
    @Param('id') id: number,
    @Body() createStockDto: CreateStockDto,
  ) {
    try {
      await this.stockService.create(id, createStockDto);

      return {
        message: 'Berhasil menambah stok',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const stock = await this.stockService.findOne(id);

      return {
        message: 'Successfuly get stock',
        data: stock,
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    try {
      await this.stockService.update(id, updateStockDto);

      return {
        message: 'Berhasil mengubah stok',
      };
    } catch (error) {
      createHttpException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.stockService.remove(id);

      return {
        message: 'Berhasil menghapus stok',
      };
    } catch (error) {
      createHttpException(error);
    }
  }
}
