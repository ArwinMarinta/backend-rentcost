import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Category } from '../categories/entities/category.entity';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { Stock } from '../stock/entities/stock.entity';

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
      throw new NotFoundException('Store not found or not authenticated');
    }

    const category = await this.dataSource
      .getRepository(Category)
      .findOne({ where: { id: createProductDto.category_id } });
    if (!category) {
      throw new NotFoundException('category not found or not authenticated');
    }

    await this.dataSource.transaction(async (stock) => {
      try {
        const newProduct = await stock
          .createQueryBuilder()
          .insert()
          .into(Product)
          .values({
            product_name: createProductDto.product_name,
            price: createProductDto.price,
            image_url: createProductDto.image_url,
            category: { id: category.id },
            store: { id: store.id },
          })
          .execute();

        const product_id = newProduct.identifiers[0].id;

        const stockData = createProductDto.size_stock.map((item) => ({
          stok: item.stok,
          available: true,
          product: { id: product_id },
          size: { id: item.size_id },
        }));

        await stock
          .createQueryBuilder()
          .insert()
          .into(Stock)
          .values(stockData)
          .execute();
      } catch (error) {
        createHttpException(error);
      }
    });
  }

  async findAll(): Promise<Product[]> {
    const products = await this.dataSource.getRepository(Product).find({
      where: {
        available: true,
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
