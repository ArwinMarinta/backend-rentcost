import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Category } from '../categories/entities/category.entity';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { Stock } from '../stock/entities/stock.entity';
import { ImageKitService } from 'src/utils/imagekit.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly fileService: ImageKitService,
    private dataSource: DataSource,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    req: any,
    url: string,
    sizeStockArray: Array<{ size_id: number; stok: number }>,
  ): Promise<void> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }
    console.log(user.id);

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
            image_url: url,
            category: { id: category.id },
            store: { id: store.id },
          })
          .execute();

        const product_id = newProduct.identifiers[0].id;

        const stockData = sizeStockArray.map((item) => ({
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
        stock: {
          available: true,
        },
      },
      relations: ['stock'],
      select: {
        id: true,
        product_name: true,
        price: true,
        image_url: true,
        stock: {
          id: true,
          stok: true,
          available: true,
        },
      },
    });

    return products;
  }

  async findByQuery(filter: string = '', search: string = ''): Promise<any[]> {
    const queryBuilder = this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .innerJoin('product.stock', 'stock', 'stock.available = true');

    if (filter && filter.includes('populer')) {
      queryBuilder.orderBy('product.rental_amount', 'DESC').limit(15);
    }

    if (filter && filter.includes('news')) {
      queryBuilder.orderBy('product.created_at', 'DESC').limit(15);
    }

    if (search) {
      queryBuilder.andWhere('product.product_name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    try {
      const products = await queryBuilder.getMany();
      return products;
    } catch (error) {
      throw new BadRequestException('Error executing query', error);
    }
  }

  async findOne(id: number) {
    const detail = await this.dataSource.getRepository(Product).findOne({
      where: { id: id },
      relations: ['stock', 'store', 'stock.size'],
      select: {
        id: true,
        product_name: true,
        rate: true,
        price: true,
        image_url: true,
        rental_amount: true,
        stock: {
          id: true,
          size: {
            id: true,
            size_name: true,
          },
          stok: true,
          available: true,
        },
        store: {
          id: true,
          store_name: true,
          store_location: true,
        },
      },
    });

    return detail;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    image_url: any,
  ): Promise<void> {
    const exitingProduct = await this.dataSource
      .getRepository(Product)
      .findOne({
        where: { id },
      });

    if (!exitingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (image_url && exitingProduct.image_url !== image_url.originalname) {
      const uploadedImage = await this.fileService.updateImage(
        image_url,
        exitingProduct.image_url,
      );

      image_url = uploadedImage.url;
    }

    await this.dataSource
      .createQueryBuilder()
      .update(Product)
      .set({
        product_name: updateProductDto.product_name,
        price: updateProductDto.price,
        image_url: image_url != null ? image_url : updateProductDto.image_url,
        category: { id: updateProductDto.category_id },
      })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number, req: any): Promise<void> {
    if (!req.user || !req.user.auth_id) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const store = await this.dataSource
      .getRepository(Store)
      .findOne({ where: { user: { id: user.id } } });

    if (!store) {
      throw new NotFoundException('Store not found or not authenticated');
    }

    const product = await this.dataSource.getRepository(Product).findOne({
      where: { id: id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.dataSource
      .getRepository(Stock)
      .delete({ product: { id: product.id } });
    await this.dataSource.getRepository(Product).delete(product.id);
  }
}
