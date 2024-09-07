import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';

@Injectable()
export class ProductsService {
  constructor(private dataSource: DataSource) {}

  async create(createProductDto: CreateProductDto, req: any): Promise<void> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: req.user.auth_id } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const store = await this.dataSource
      .getRepository(Store)
      .findOne({ where: { user: { id: user.id } } });

    if (!store) {
      throw new NotFoundException('store not found or not authenticated');
    }
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values({ ...createProductDto, store })
      .execute();
  }

  async findAll(): Promise<Product[]> {
    const products = await this.dataSource.getRepository(Product).find({
      select: {
        id: true,
        product_name: true,
      },
    });

    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.dataSource.getRepository(Product).findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.dataSource
      .createQueryBuilder()
      .update(Product)
      .set(updateProductDto)
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number): Promise<void> {
    const product = await this.dataSource.getRepository(Product).findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.dataSource.getRepository(Product).delete(product.id);
  }
}
