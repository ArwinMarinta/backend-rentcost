import { Module } from '@nestjs/common';
import { TransactionItemsService } from './transaction_items.service';
import { TransactionItemsController } from './transaction_items.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TransactionItemsController],
  providers: [TransactionItemsService],
  imports: [JwtModule],
})
export class TransactionItemsModule {}
