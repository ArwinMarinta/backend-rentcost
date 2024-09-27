import { Module } from '@nestjs/common';
import { TransactionItemsService } from './transaction_items.service';
import { TransactionItemsController } from './transaction_items.controller';

@Module({
  controllers: [TransactionItemsController],
  providers: [TransactionItemsService],
})
export class TransactionItemsModule {}
