import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { Cart } from './entities/cart.entity';
import { CartsItem } from '../carts_item/entities/carts_item.entity';

@Injectable()
export class CartsService {
  constructor(private dataSource: DataSource) {}

  async create(id: number, req: any, createCartDto: CreateCartDto) {
    const product = await this.dataSource
      .getRepository(Product)
      .findOne({ where: { id: id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    await this.dataSource.transaction(async (shop) => {
      try {
        // Cek apakah cart sudah ada untuk user
        const existingCart = await shop
          .getRepository(Cart)
          .findOne({ where: { user: { id: user.id } } }); // Menggunakan user.id

        if (existingCart) {
          // Jika cart sudah ada, tambahkan item ke cart yang sudah ada
          await shop
            .createQueryBuilder()
            .insert()
            .into(CartsItem)
            .values({
              quantity: createCartDto.quantity,
              cart: { id: existingCart.id }, // Referensi cart yang sudah ada
              product: product,
            })
            .execute();
        } else {
          // Jika tidak ada cart, buat cart baru
          const cart = await shop
            .createQueryBuilder()
            .insert()
            .into(Cart)
            .values({ user: user })
            .execute();

          const cartId = cart.identifiers[0].id;

          await shop
            .createQueryBuilder()
            .insert()
            .into(CartsItem)
            .values({
              quantity: createCartDto.quantity,
              cart: { id: cartId },
              product: product,
            })
            .execute();
        }
      } catch (error) {
        createHttpException(error);
      }
    });
  }

  async findById(req: any) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const carts = await this.dataSource
      .getRepository(Cart)
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItem', 'cartItem') // Join dengan tabel CartItem
      .leftJoinAndSelect('cartItem.product', 'product') // Join dengan tabel Product jika ada
      .where('cart.user = :userId', { userId: user.id })
      .getMany(); // Mengambil semua keranjang terkait;

    if (!carts || carts.length === 0) {
      throw new NotFoundException('No carts found for this user');
    }

    return carts.map((cart) => ({
      cartId: cart.id,
      items: (cart.cartItem || [])
        .map((cartItem) => {
          if (cartItem && cartItem.product) {
            return {
              cartItemId: cartItem.id,
              quantity: cartItem.quantity,
              product: {
                productId: cartItem.product.id,
                productName: cartItem.product.product_name,
                price: cartItem.product.price,
              },
            };
          }
          return null; // Atau bisa disesuaikan dengan apa yang ingin kamu lakukan jika null
        })
        .filter((item) => item !== null), // Filter untuk menghapus item yang null
    }));
  }

  findAll() {
    return `This action returns all carts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
