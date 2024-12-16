import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionItem } from '../transaction_items/entities/transaction_item.entity';
import { Stock } from '../stock/entities/stock.entity';
import { CartsItem } from '../carts_item/entities/carts_item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { Store } from '../stores/entities/store.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class TransactionsService {
  constructor(private dataSource: DataSource) {}
  async create(
    req: any,
    url: string,
    createTransactionDto: CreateTransactionDto,
    productsArray: Array<{ productId: number; sizeId: number }>,
  ) {
    console.log(productsArray);
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const cart = await this.dataSource
      .getRepository(Cart)
      .findOne({ where: { user: { id: user.id } } });

    if (!cart) {
      throw new NotFoundException('Cart not found ');
    }

    await this.dataSource.transaction(async (transaction) => {
      const newTransaksi = await transaction
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values({
          total_price: createTransactionDto.price,
          payment_image: url,
          user: { id: user.id },
        })
        .execute();

      const transaction_id = newTransaksi.identifiers[0].id;

      const transactionItems = productsArray.map((productId) => ({
        transaction: transaction_id,
        product: { id: productId.productId },
        size: { id: productId.sizeId },
        quantity: 1,
      }));

      await transaction
        .createQueryBuilder()
        .insert()
        .into(TransactionItem)
        .values(transactionItems)
        .execute();

      for (const productId of productsArray) {
        // Mengambil data stok berdasarkan productId
        const stock = await transaction
          .getRepository(Stock)
          .findOne({ where: { product: { id: productId.productId } } });

        // Memeriksa apakah stok tidak ada atau jumlahnya kurang dari atau sama dengan 0
        if (!stock || stock.stok <= 0) {
          throw new BadRequestException(
            `Stock for Product ID ${productId} is insufficient`,
          );
        }

        // Update stok: mengurangi quantity
        await transaction
          .createQueryBuilder()
          .update(Stock)
          .set({ stok: stock.stok - 1 }) // Kurangi stok
          .where('id = :stockId', { stockId: stock.id })
          .execute();

        await transaction
          .createQueryBuilder()
          .delete()
          .from(CartsItem)
          .where('productId = :productId', { productId: productId.productId })
          .andWhere('cartId = :cartId', { cartId: cart.id })
          .execute();

        const product = await transaction
          .getRepository(Product)
          .findOne({ where: { id: productId.productId } });

        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        // Tambahkan rental_amount sebesar 1
        product.rental_amount += 1;

        // Simpan perubahan pada produk
        await transaction.getRepository(Product).save(product); // Simpan perubahan pada entitas Product
      }
    });
  }

  async findTenant(req: any) {
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

    const history = await this.dataSource.getRepository(TransactionItem).find({
      where: { product: { store: { id: store.id } } },
      relations: ['product', 'product.category'],
    });

    return history;
  }

  async findUser(req: any) {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { auth: { id: req.user.auth_id } } });

    if (!user) {
      throw new NotFoundException('User not found or not authenticated');
    }

    const history = await this.dataSource
      .getRepository(TransactionItem)
      .createQueryBuilder('transactionItem')
      .leftJoinAndSelect('transactionItem.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('transactionItem.size', 'size')
      .leftJoin('transactionItem.transaction', 'transaction')
      .leftJoin('transaction.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getMany();

    return history;
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
