import { Module } from '@nestjs/common';
import { CartsItemService } from './carts_item.service';
import { CartsItemController } from './carts_item.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CartsItemController],
  providers: [CartsItemService],
  imports: [JwtModule],
})
export class CartsItemModule {}
