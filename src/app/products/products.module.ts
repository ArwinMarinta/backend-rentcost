import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { JwtModule } from '@nestjs/jwt';
import { ImageKitService } from 'src/utils/imagekit.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ImageKitService],
  imports: [JwtModule],
})
export class ProductsModule {}
