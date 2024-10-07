import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  imports: [JwtModule],
})
export class CartsModule {}
