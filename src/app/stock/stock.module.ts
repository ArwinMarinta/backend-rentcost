import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [StockController],
  providers: [StockService],
  imports: [JwtModule],
})
export class StockModule {}
