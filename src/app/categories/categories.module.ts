import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { JwtModule } from '@nestjs/jwt';
import { ImageKitService } from 'src/utils/imagekit.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, ImageKitService],
  imports: [JwtModule],
})
export class CategoriesModule {}
