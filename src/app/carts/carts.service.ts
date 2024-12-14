import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { createHttpException } from 'src/common/middlewares/utils/http-exception.util';
import { Cart } from './entities/cart.entity';
import { CartsItem } from '../carts_item/entities/carts_item.entity';
import { Size } from '../sizes/entities/size.entity';

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

    const size = await this.dataSource
      .getRepository(Size)
      .findOne({ where: { id: createCartDto.size_id } });

    if (!size) {
      throw new NotFoundException('Size not found');
    }

    await this.dataSource.transaction(async (shop) => {
      try {
        // Cek apakah cart sudah ada untuk user
        const existingCart = await shop
          .getRepository(Cart)
          .findOne({ where: { user: { id: user.id } } });

        if (existingCart) {
          // Cek apakah produk sudah ada dalam cart
          const existingCartItem = await shop.getRepository(CartsItem).findOne({
            where: {
              cart: { id: existingCart.id },
              product: { id: product.id },
            },
          });

          if (existingCartItem) {
            throw new ConflictException('Produk sudah ada didalam keranjang');
          } else {
            // Jika produk belum ada, tambah produk baru
            await shop
              .createQueryBuilder()
              .insert()
              .into(CartsItem)
              .values({
                quantity: 1,
                size: { id: size.id },
                cart: { id: existingCart.id },
                product: product,
              })
              .execute();
          }
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
              quantity: 1,
              size: { id: size.id },
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
      .leftJoinAndSelect('cartItem.product', 'product') // Join dengan tabel Product
      .leftJoinAndSelect('product.stock', 'stock') // Join dengan tabel Stocks (one-to-many)
      .leftJoinAndSelect('cart.shippingAddress', 'address')
      .where('cart.user = :userId', { userId: user.id })
      .getMany(); // Mengambil semua keranjang terkait

    if (!carts || carts.length === 0) {
      throw new NotFoundException('No carts found for this user');
    }

    return carts.map((cart) => ({
      cartId: cart.id,
      shippingAddress: cart.address
        ? {
            username: cart.address.username,
            phone_number: cart.address.phone_number,
            city: cart.address.city,
            state: cart.address.state,
            address1: cart.address.address1,
            address2: cart.address.address2,
            zip_zode: cart.address.zip_code,
          }
        : null,
      items: (cart.cartItem || [])
        .map((cartItem) => {
          if (cartItem && cartItem.product) {
            return {
              cartItemId: cartItem.id,
              quantity: cartItem.quantity,
              product: {
                productId: cartItem.product.id,
                product_name: cartItem.product.product_name,
                price: cartItem.product.price,
                rate: cartItem.product.rate,
                image_url: cartItem.product.image_url,
                rental_amount: cartItem.product.rental_amount,
              },
              stock: (cartItem.product.stock || []).map((stock) => ({
                stockId: stock.id,
                available: stock.available,
                stok: stock.stok,
              })),
            };
          }
          return null; // Atau bisa disesuaikan dengan apa yang ingin Anda lakukan jika null
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

  update(id: number) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
