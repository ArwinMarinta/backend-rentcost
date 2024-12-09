import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(private dataSource: DataSource) {}

  async create(id: number, createStockDto: CreateStockDto): Promise<void> {
    const product = await this.dataSource
      .getRepository(Product)
      .findOne({ where: { id: id } });

    if (!product) {
      throw new NotFoundException('Product tidak ditemukan');
    }

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Stock)
      .values({
        stok: createStockDto.stok,
        size: { id: createStockDto.size_id },
        product: { id: id },
      })
      .execute();
  }

  findAll() {
    return `This action returns all stock`;
  }

  async findOne(id: number): Promise<any> {
    const stock = await this.dataSource.getRepository(Stock).findOne({
      where: { id: id },
      relations: ['size'],
      select: ['id', 'stok'],
    });

    return stock;
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    const stock = await this.dataSource
      .getRepository(Stock)
      .findOne({ where: { id: id } });

    if (!stock) {
      throw new NotFoundException('Stock tidak ditemukan');
    }

    await this.dataSource
      .createQueryBuilder()
      .update(Stock)
      .set({
        stok: updateStockDto.stok,
        size: { id: updateStockDto.size_id },
      })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number) {
    const stock = await this.dataSource
      .getRepository(Stock)
      .findOne({ where: { id: id } });

    if (!stock) {
      throw new NotFoundException('Stock tidak ditemukan');
    }

    await this.dataSource.getRepository(Stock).delete(stock.id);
  }
}
