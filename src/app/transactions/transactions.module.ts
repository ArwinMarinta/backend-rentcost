import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { JwtModule } from '@nestjs/jwt';
import { ImageKitService } from 'src/utils/imagekit.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, ImageKitService],
  imports: [JwtModule],
})
export class TransactionsModule {}
