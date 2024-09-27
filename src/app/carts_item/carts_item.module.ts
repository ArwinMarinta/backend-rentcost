import { Module } from '@nestjs/common';
import { CartsItemService } from './carts_item.service';
import { CartsItemController } from './carts_item.controller';

@Module({
  controllers: [CartsItemController],
  providers: [CartsItemService],
})
export class CartsItemModule {}
